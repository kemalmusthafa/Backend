create schema loket;

set search_path to loket;

create table users (
	user_id serial primary key,
	name varchar(255) not null,
	email varchar(255) unique not null,
	password varchar(255) not null,
	phone_number varchar(15) not null,
	user_type varchar(50) check (user_type in ('promotor', 'user')),
	created_at timestamptz default current_timestamp
);

create table events (
	event_id serial primary key,
	promotor_id integer references users(user_id),
	event_name varchar(255) not null,
	category_id integer references categories(category_id),
	venue_id integer references venues(venue_id),
	description text not null,
	start_time timestamptz not null,
	end_time timestamptz not null,
	created_at timestamptz default current_timestamp
);

create table tickets (
	tickets_id serial primary key,
	event_id integer references events(event_id),
	ticket_type varchar(50) not null,
	price numeric(10, 2) not null,
	quantity integer not null,
	remaining_quantity integer not null,
	created_at timestamptz default current_timestamp
);

create table orders (
	order_id serial primary key,
	user_id integer references users(user_id),
	event_id integer references events(event_id),
	order_date timestamptz default current_timestamp,
	total_price numeric (10, 2) not null
);

create table orders_details (
	order_detail_id serial primary key,
	order_id integer references orders(order_id),
	ticket_id integer references tickets(tickets_id),
	quantity integer not null,
	subtotal numeric (10, 2) not null
);

create table payments (
	payment_id serial primary key,
	order_id integer references orders(order_id),
	payment_method varchar(50) not null,
	payment_status varchar(50) check (payment_status in ('pending', 'completed', 'failed')),
	payment_date timestamptz default current_timestamp
);

create table categories (
	category_id serial primary key,
	category_name varchar(100) unique not null
);

create table venues (
	venue_id serial primary key,
	venue_name varchar(255) not null,
	address text,
	city varchar(100),
	capacity integer not null
);

select * from events where promotor_id = 1;
select ticket_type, remaining_quantity from tickets where event_id = 2;
SELECT o.order_id, e.event_name, od.quantity, od.subtotal
FROM orders o
JOIN orders_details od ON o.order_id = od.order_id
JOIN events e ON o.event_id = e.event_id
WHERE o.user_id = 3;

insert into users (name, email, password, phone_number, user_type, created_at)
values ('pale', 'pale@example.com', 'Asd1234', '0812345678', 'promotor', '2024-10-10');

insert into users (name, email, password, phone_number, user_type, created_at)
values ('nata', 'nata@example.com', 'Asd1234', '0812345678', 'user', current_timestamp);

select * from users;
