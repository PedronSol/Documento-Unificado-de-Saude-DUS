/*
DROP DATABASE IF EXISTS dus_db;

CREATE DATABASE dus_db;

USE dus_db;
*/
-- =====================================================
-- =====================PACIENTES=======================
-- =====================================================
CREATE TABLE pacientes(
	cpf_paciente 		CHAR(11) PRIMARY KEY,
    CHECK (cpf_paciente REGEXP '^[0-9]{11}$'),
    
    nome_paciente 		VARCHAR(20) 	NOT NULL,
    nome_completo 		VARCHAR(100)	NOT NULL,
    email				VARCHAR(30)		NOT NULL,
    senha_hash			VARCHAR(255) 	NOT NULL,
    avatar				VARCHAR(255),
    
    status_saude		ENUM(
							'updated',
							'pending',
							'overdue'
						),
    
    tipo_sanguineo		ENUM(
							'A+',
							'A-',
							'B+',
							'B-',
							'AB+',
							'AB-',
							'O+',
							'O-'
						),
	
    valor_qr			VARCHAR(255)
);

-- =====================================================
-- =====================VACINAS=========================
-- =====================================================
CREATE TABLE vacinas (
    id_vacina 					INT AUTO_INCREMENT,
    paciente_id 				CHAR(11),
    nome_vacina 				VARCHAR(100),
    dose 						VARCHAR(50),
    data_aplicacao 				DATE,
    
    status_vacina ENUM(
        'pending',
        'applied',
        'overdue'
    ),

    PRIMARY KEY (id_vacina, paciente_id),

    FOREIGN KEY (paciente_id) REFERENCES pacientes(cpf_paciente)
);

-- =====================================================
-- =====================ALERTAS=========================
-- =====================================================
CREATE TABLE alertas(
	id_alerta					INT AUTO_INCREMENT,
    paciente_id					CHAR(11),
    
    tipo_alerta					ENUM(
									'condition',
									'medication',
                                    'allergy'
								),
	
    titulo_alerta				VARCHAR(50),
    descricao_alerta			VARCHAR(200),
    
    severidade_alerta			ENUM(
									'low',
                                    'medium',
                                    'high'
								),
                                
	PRIMARY KEY (id_alerta,paciente_id),
    
    FOREIGN KEY (paciente_id) REFERENCES pacientes(cpf_paciente)
);

-- =====================================================
-- =====================ALERTAS=========================
-- =====================================================
CREATE TABLE documentos(
	id_documento					INT AUTO_INCREMENT,
    paciente_id						CHAR(11),
    titulo_documento				VARCHAR(50),
    tipo_documento					VARCHAR(20),
    data_criacao_documento			DATE,
    
    status_documento				ENUM(
										'viewed',
                                        'new'
                                    ),
                                    
	PRIMARY KEY (id_documento, paciente_id),
    
    FOREIGN KEY (paciente_id) REFERENCES pacientes(cpf_paciente)
)