-- =======================VIEWS=========================
-- =====================================================

-- ============HISTÓRICO VACINAL COMPLETO===============
CREATE OR REPLACE VIEW historico_vacinal AS

SELECT
    p.cpf_paciente,
    p.nome_paciente,
    p.tipo_sanguineo,

    v.id_vacina,
    v.nome_vacina,
    v.dose,
    v.data_aplicacao,
    v.status_vacina

FROM pacientes p

JOIN vacinas v
ON p.cpf_paciente = v.paciente_id;

-- ======================================================

-- ================VACINAS PENDENTES=====================
CREATE OR REPLACE VIEW vacinas_pendentes AS

SELECT
    p.nome_paciente,
    v.nome_vacina,
    v.dose

FROM pacientes p

JOIN vacinas v
ON p.cpf_paciente = v.paciente_id

WHERE v.status_vacina = 'pending';

-- ======================================================

-- ================VACINAS ATRASADAS=====================
CREATE OR REPLACE VIEW vacinas_atrasadas AS

SELECT
    p.nome_paciente,
    v.nome_vacina,
    v.dose

FROM pacientes p

JOIN vacinas v
ON p.cpf_paciente = v.paciente_id

WHERE v.status_vacina = 'overdue';