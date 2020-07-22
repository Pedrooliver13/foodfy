-- receipts
DROP TABLE receipts;

CREATE TABLE receipts (
  id SERIAL PRIMARY KEY,
  title text,
  user_id integer,
  ingredients text [],
  preparation text[],
  information text,
  created_at timestamp DEFAULT(now()),
  updated_at TIMESTAMP DEFAULT(now())
);

CREATE TABLE chefs (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  file_id INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- foreign key 
ALTER TABLE chefs
ADD FOREIGN KEY ("file_id")
REFERENCES recipe_files ("id");


-- users
DROP TABLE users;

CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	name TEXT NOT NULL,
	email TEXT UNIQUE NOT NULL,
	password TEXT NOT NULL,
	reset_token TEXT,
	reset_token_expires TEXT,
	is_admin BOOLEAN DEFAULT false,
	updated_at TIMESTAMP DEFAULT now(),
	created_at TIMESTAMP DEFAULT now()
);

-- foreign key 
ALTER TABLE "receipts" 
ADD FOREIGN KEY ("user_id")
REFERENCES "users" ("id");

-- files 
DROP TABLE files;

CREATE TABLE files (
  id SERIAL PRIMARY KEY,
  name text,
  path text NOT NULL
);

-- receipts files
DROP TABLE recipe_files;

CREATE TABLE recipe_files (
  id SERIAL PRIMARY KEY,
  recipe_id integer,
  file_id integer
);

-- REFERENCIAS  IMAGENS (FOREIGN KEY);
ALTER TABLE "recipe_files"
ADD FOREIGN KEY ("recipe_id")
REFERENCES "receipts" ("id")
ON DELETE CASCADE 
ON UPDATE CASCADE;

-- references files 
ALTER TABLE "recipe_files"
ADD FOREIGN KEY ("file_id")
REFERENCES "files" ("id")
ON DELETE CASCADE
ON UPDATE CASCADE;

--SESSION
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);
ALTER TABLE "session"
ADD CONSTRAINT "session_pkey"
PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;




-- * procedure auto updated_at;
CREATE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
$$ LANGUAGE plpgsql;



-- ? triggers;
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON receipts
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();

