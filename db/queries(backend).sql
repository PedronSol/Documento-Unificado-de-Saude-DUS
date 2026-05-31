
-- ===============================QUERIES PARA POSSÍVEL USO NO BACKEND=============================
-- ================================================================================================
-- BUSCAR PACIENTE POR CPF
SELECT *
FROM pacientes
WHERE cpf_paciente = %s;

-- ================================================================================================

-- BUSCAR VACINAS DO PACIENTE
SELECT
    nome_vacina,
    dose,
    data_aplicacao,
    status_vacina

FROM vacinas
WHERE paciente_id = %s;

-- ================================================================================================

-- BUSCAR HISTÓRICO DO PECIENTE PELA VIEW
SELECT *
FROM historico_vacinal
WHERE cpf_paciente = %s;


-- ================================================================================================

-- BUSCAR PACIENTE POR EMAIL
SELECT *
FROM pacientes
WHERE email = %s;

-- ================================================================================================

-- BUSCAR VACINAS APLICADAS
SELECT
    nome_vacina,
    dose,
    data_aplicacao

FROM vacinas

WHERE paciente_id = %s
AND status_vacina = 'applied';

-- ================================================================================================

-- BUSCAR VACINAS PENDENTES
SELECT
    nome_vacina,
    dose

FROM vacinas

WHERE paciente_id = %s
AND status_vacina = 'pending';

-- ================================================================================================

-- BUSCAR PACIENTE POR TIPO SANGUINEO
SELECT
    nome_paciente,
    email

FROM pacientes

WHERE tipo_sanguineo = %s;

-- ================================================================================================

-- BUSCAR VACINA ESPECÍFICA
SELECT *
FROM vacinas
WHERE nome_vacina = %s;

-- ================================================================================================

-- LOGIN POR EMAIL E SENHA
SELECT *
FROM pacientes
WHERE email = %s
AND senha_hash = %s;

-- ================================================================================================

-- ATUALIZAR STATUS DA VACINA
UPDATE vacinas

SET status_vacina = %s

WHERE id_vacina = %s;

-- ================================================================================================

-- REGISTRAR NOVA VACINA
INSERT INTO vacinas (

    paciente_id,
    nome_vacina,
    dose,
    data_aplicacao,
    status_vacina

)

VALUES (

    %s,
    %s,
    %s,
    %s,
    %s

);

-- ================================================================================================

-- ATUALIZAR AVATAR DO PACIENTE
UPDATE pacientes

SET avatar = %s

WHERE cpf_paciente = %s;