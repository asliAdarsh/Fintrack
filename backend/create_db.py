import sqlalchemy

engine = sqlalchemy.create_engine('postgresql+pg8000://postgres:adarsh9966@localhost:5432/postgres', isolation_level='AUTOCOMMIT')

with engine.connect() as conn:
    try:
        conn.execute(sqlalchemy.text('CREATE DATABASE fintrack_db;'))
        print("Database fintrack_db created successfully.")
    except sqlalchemy.exc.ProgrammingError as e:
        if "already exists" in str(e):
            print("Database fintrack_db already exists.")
        else:
            raise e
