export const queries = {
  createTable: `
    CREATE TABLE IF NOT EXISTS duties (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(100) NOT NULL,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      is_completed BOOLEAN NOT NULL DEFAULT false
    );
  `,
  insertDuty: `
    INSERT INTO duties (name) VALUES ($1) RETURNING *;
  `,
  selectAllDuties: `
    SELECT id, name, created_at, updated_at, is_completed FROM duties ORDER BY created_at ASC;
  `,
  selectDutyById: `
    SELECT * FROM duties WHERE id = $1;
  `,
  updateDuty: `
    UPDATE duties SET name = $1, is_completed = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *;
  `,
  updateDutyName: `UPDATE duties SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
  updateDutyStatus: `UPDATE duties SET is_completed = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *`,
  deleteDuty: `
    DELETE FROM duties WHERE id = $1 RETURNING *;
  `,
}
