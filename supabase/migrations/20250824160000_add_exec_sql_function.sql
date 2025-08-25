-- Migration pour ajouter la fonction exec_sql qui permet d'exécuter du SQL personnalisé
CREATE OR REPLACE FUNCTION exec_sql(sql TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE sql;
END;
$$;