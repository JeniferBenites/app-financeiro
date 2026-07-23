-- CORREÇÃO: cast explícito text -> enum no bootstrap do usuário.
-- Cole e rode no SQL Editor. É seguro rodar quantas vezes quiser.
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
  insert into public.profiles (id, nome)
  values (new.id, coalesce(new.raw_user_meta_data->>'nome', 'Você'))
  on conflict (id) do nothing;

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
