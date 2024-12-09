create schema test;

set search_path to test;

create type type_expense as enum ('income','expense');
create type category_expense as enum ('salary','food','transport');


create table expense (
    id serial primary key,
    title varchar(255) not null,
    nominal integer not null,
    type type_expense not null,
    category category_expense not null,
    date date not null    
);

drop table if exists expense;

alter table expense add column nama varchar(255);

alter table expense drop column nama;

insert into expense (title, nominal, "type", category, "date")
values ('Gaji bulan oktober',100000, 'income', 'salary', '2024-11-01');

insert into test.expense (title, nominal, "type", category, "date")
values 
('Beli Bensin',50000,'expense','food', '2024-11-04'),
('Naik Gojek',20000,'expense','transport','2024-11-05');

select * from  expense e order by id asc limit 2 offset 2;

select * from test.expense e ;

select id, title from expense e ;

select  * from expense e where e."type" = 'expense';

select  * from expense e where e.category = 'salary';

update expense set nominal = 10000 where id=4;

select "type", sum(nominal) from expense e group by "type" having "type" = 'income'; 

delete from expense where id = 3;