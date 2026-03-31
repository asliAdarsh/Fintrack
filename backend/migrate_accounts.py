import sqlalchemy
from sqlalchemy import text

DB_URI = 'postgresql+pg8000://postgres:adarsh9966@localhost:5432/fintrack_db'

def migrate():
    try:
        engine = sqlalchemy.create_engine(DB_URI, isolation_level='AUTOCOMMIT')
        with engine.connect() as conn:
            check_column = conn.execute(text(
                "SELECT column_name FROM information_schema.columns WHERE table_name='accounts' AND column_name='type';"
            )).fetchone()
            
            if not check_column:
                conn.execute(text("ALTER TABLE accounts ADD COLUMN type VARCHAR(50) DEFAULT 'Checking';"))
                print("Column 'type' added to 'accounts' table.")
            else:
                print("Column 'type' already exists.")
                
            conn.execute(text("UPDATE accounts SET type = 'Checking' WHERE type IS NULL;"))
            
        print("Migration complete.")
    except Exception as e:
        print(f"Migration failed: {e}")

if __name__ == "__main__":
    migrate()
