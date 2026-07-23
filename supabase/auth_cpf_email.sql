-- ============================================================================
-- Login por CPF + e-mail para confirmação da conta.
-- Adiciona CPF ao perfil, atualiza o bootstrap e cria a busca CPF -> e-mail.
-- Cole no SQL Editor e rode. Idempotente.
-- ============================================================================

-- 1) coluna cpf no perfil
alter table public.profiles add column if not exists cpf text;
create unique index if not exists uq_profiles_cpf on public.profiles(cpf) where cpf is not null;

-- 2) bootstrap: agora também grava o CPF vindo do cadastro (metadata)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  ladder numeric[] := array[12000,25000,50000,100000,250000,500000,1000000,2000000,5000000,10000000];
  titulos text[] := array[
    'Reserva de emergência','Primeiro degrau','Ganhando ritmo','Seis dígitos',
    'Um quarto de milhão','Meio milhão','O primeiro milhão','Dois milhões',
    'Cinco milhões','Independência 10X'];
  i int;
begin
  insert into public.profiles (id, nome, cpf)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nome', 'Você'),
    nullif(regexp_replace(coalesce(new.raw_user_meta_data->>'cpf',''), '\D', '', 'g'), '')
  )
  on conflict (id) do update set
    nome = coalesce(excluded.nome, public.profiles.nome),
    cpf  = coalesce(excluded.cpf,  public.profiles.cpf);

  insert into public.financial_profiles (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  for i in 1 .. array_length(ladder, 1) loop
    insert into public.goals (user_id, ordem, titulo, valor_alvo, status)
    values (new.id, i, titulos[i], ladder[i],
            (case when i = 1 then 'ativa' else 'bloqueada' end)::goal_status)
    on conflict (user_id, ordem) do nothing;
  end loop;

  return new;
end;
$$;

-- 3) backfill: preenche o CPF de usuários que já existem (a partir do metadata)
update public.profiles p
set cpf = nullif(regexp_replace(coalesce(u.raw_user_meta_data->>'cpf',''), '\D', '', 'g'), '')
from auth.users u
where u.id = p.id and p.cpf is null
  and coalesce(u.raw_user_meta_data->>'cpf','') <> '';

-- 4) busca CPF -> e-mail (para o login por CPF). SECURITY DEFINER: lê auth.users.
create or replace function public.email_by_cpf(p_cpf text)
returns text
language sql
security definer
set search_path = public
as $$
  select u.email
  from public.profiles pr
  join auth.users u on u.id = pr.id
  where pr.cpf = regexp_replace(coalesce(p_cpf,''), '\D', '', 'g')
  limit 1;
$$;

grant execute on function public.email_by_cpf(text) to anon, authenticated;
