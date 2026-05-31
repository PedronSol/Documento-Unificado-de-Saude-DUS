-- TESTANDO INSERIR paciente_id INEXISTENTE
INSERT INTO vacinas(
					id_vacina,
                    paciente_id,
                    nome_vacina,
                    dose,
                    data_aplicacao,
                    status_vacina
) VALUES
	  ('1', 99999999999, 'Influenza', 'Dose Anual', '2010-10-01', 'applied');

-- Error Code: 1452. Cannot add or update a child row: a foreign key constraint fails (`dus_db`.`vacinas`, CONSTRAINT `vacinas_ibfk_1` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`cpf_paciente`))
-- TESTE OK

-- ================================================================================================

-- TESTANDO SELECIONAR TODOS OS PACIENTES
SELECT * FROM pacientes;

-- 10 row(s) returned
-- TESTE OK

-- ================================================================================================

-- TESTANDO 'SELECT' ESPECÍFICOS 
SELECT *
FROM vacinas
WHERE paciente_id = '00011122222';

-- 3 row(s) returned
-- TESTE OK

-- ================================================================================================

-- TESTANDO	JOIN (nome_paciente da tabela pacientes, nome_vacina da tabela vacinas, dose da tabela vacinas e data_aplicacao da tabela vacinas | onde paciente_id = cpf_paciente
SELECT
    p.nome_paciente,
    v.nome_vacina,
    v.dose,
    v.data_aplicacao

FROM vacinas AS v

JOIN pacientes AS p
ON v.paciente_id = p.cpf_paciente;

-- 25 row(s) returned
-- TESTE OK

-- ================================================================================================

-- TESTANDO PEDIR AS VACINAS PENDENTES
SELECT *
FROM vacinas
WHERE status_vacina = 'pending';

-- 3 row(s) returned
-- TESTE OK

-- ================================================================================================

-- TESTANDO PEDIR OS PACIENTES COM SANGUE O+
SELECT nome_paciente
FROM pacientes
WHERE tipo_sanguineo = 'O+';

-- 2 row(s) returned
-- TESTE OK

-- ================================================================================================
-- TESTANDO PEDIR AS TODAS AS VACINAS E DATAS DE APLICAÇÃO DE UM PACIENTE (HISTORICO DE VACINAS)
SELECT
    p.nome_paciente,
    v.nome_vacina,
    v.data_aplicacao

FROM pacientes AS p

JOIN vacinas AS v
ON p.cpf_paciente = v.paciente_id

WHERE p.cpf_paciente = '00011122222';

-- 3 row(s) returned
-- TESTE OK
