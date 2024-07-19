export const queries = {
  createTable: `
    CREATE TABLE IF NOT EXISTS duties (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(100) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `,
  insertDuty: `
    INSERT INTO duties (name) VALUES ($1) RETURNING id, name, created_at, updated_at;
  `,
  selectAllDuties: `
    SELECT * FROM duties;
  `,
  selectDutyById: `
    SELECT * FROM duties WHERE id = $1;
  `,
  updateDuty: `
    UPDATE duties SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *;
  `,
  deleteDuty: `
    DELETE FROM duties WHERE id = $1 RETURNING *;
  `,
}
