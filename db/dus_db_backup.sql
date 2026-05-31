CREATE DATABASE  IF NOT EXISTS `dus_db` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `dus_db`;
-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: dus_db
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `alertas`
--

DROP TABLE IF EXISTS `alertas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `alertas` (
  `id_alerta` int NOT NULL AUTO_INCREMENT,
  `paciente_id` char(11) NOT NULL,
  `tipo_alerta` enum('condition','medication','allergy') DEFAULT NULL,
  `titulo_alerta` varchar(50) DEFAULT NULL,
  `descricao_alerta` varchar(200) DEFAULT NULL,
  `severidade_alerta` enum('low','medium','high') DEFAULT NULL,
  PRIMARY KEY (`id_alerta`,`paciente_id`),
  KEY `paciente_id` (`paciente_id`),
  CONSTRAINT `alertas_ibfk_1` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`cpf_paciente`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `alertas`
--

LOCK TABLES `alertas` WRITE;
/*!40000 ALTER TABLE `alertas` DISABLE KEYS */;
INSERT INTO `alertas` VALUES (1,'00000000001','condition','Insuficiência Renal Leve','Necessidade de monitoramento de creatinina.','medium'),(1,'00011122222','condition','Hipertensão','Diagnosticada em 2021. Controlada.','medium'),(1,'11111111111','condition','Hipotireoidismo','Diagnosticado em 2018.','medium'),(1,'11122233344','allergy','Alergia a Dipirona','Urticária severa e edema de glote.','high'),(1,'12312312312','allergy','Alergia a Sulfa','Causa erupções cutâneas graves.','high'),(1,'12345678900','condition','Asma Moderada','Uso de bombinha em crises sazonais.','medium'),(1,'14235486778','allergy','Intolerância Severa à Lactose','Problemas gastrointestinais agudos.','medium'),(1,'98765432111','allergy','Alergia a Frutos do Mar','Choque anafilático com camarão.','high'),(2,'00011122222','medication','Losartana 50mg','Tomar 1x ao dia pela manhã.','low'),(2,'11111111111','medication','Puran T4 50mcg','1 comprimido em jejum diário.','low'),(2,'12345678900','medication','Aerolin Spray','Uso SOS se houver falta de ar.','low');
/*!40000 ALTER TABLE `alertas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `documentos`
--

DROP TABLE IF EXISTS `documentos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `documentos` (
  `id_documento` int NOT NULL AUTO_INCREMENT,
  `paciente_id` char(11) NOT NULL,
  `titulo_documento` varchar(50) DEFAULT NULL,
  `tipo_documento` varchar(20) DEFAULT NULL,
  `data_criacao_documento` date DEFAULT NULL,
  `status_documento` enum('viewed','new') DEFAULT NULL,
  PRIMARY KEY (`id_documento`,`paciente_id`),
  KEY `paciente_id` (`paciente_id`),
  CONSTRAINT `documentos_ibfk_1` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`cpf_paciente`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `documentos`
--

LOCK TABLES `documentos` WRITE;
/*!40000 ALTER TABLE `documentos` DISABLE KEYS */;
INSERT INTO `documentos` VALUES (1,'00000000001','Creatinina e Ureia ','exam ','2024-05-14','new'),(1,'00011122222','Eletrocardiograma ','exam ','2024-03-12','viewed'),(1,'00111223401','Beta HCG Quantitativo ','exam ','2024-05-18','new'),(1,'11111111111','Dosagem de TSH e T4 Livre ','exam ','2024-04-22','viewed'),(1,'11122233344','Hemograma e Ferro ','exam ','2024-05-10','new'),(1,'11123423298','Check-up Geral ','exam ','2024-04-19','viewed'),(1,'12312312312','Receita Dermatologista ','prescription ','2024-05-20','new'),(1,'12345678900','Espirometria ','exam ','2023-10-20','viewed'),(1,'14235486778','Exame de Fezes ','exam ','2024-04-03','viewed'),(1,'98765432111','Teste Alérgico Prick Test ','exam ','2023-10-10','viewed'),(2,'00000000001','Laudo Nefrológico ','report ','2024-05-15','new'),(2,'00011122222','Receita - Dr. Marcos Lima ','prescription ','2024-03-12','viewed'),(2,'00111223401','Ultrassonografia Obstétrica ','exam ','2024-05-25','new'),(2,'11111111111','Receita - Dra. Elena Cruz ','prescription ','2024-04-23','viewed'),(2,'11122233344','Atestado Médico ','report ','2024-05-11','viewed'),(2,'14235486778','Encaminhamento Nutricionista ','report ','2024-04-04','viewed');
/*!40000 ALTER TABLE `documentos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Temporary view structure for view `historico_vacinal`
--

DROP TABLE IF EXISTS `historico_vacinal`;
/*!50001 DROP VIEW IF EXISTS `historico_vacinal`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `historico_vacinal` AS SELECT 
 1 AS `nome_paciente`,
 1 AS `nome_vacina`,
 1 AS `data_aplicacao`*/;
SET character_set_client = @saved_cs_client;

--
-- Table structure for table `pacientes`
--

DROP TABLE IF EXISTS `pacientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `pacientes` (
  `cpf_paciente` char(11) NOT NULL,
  `nome_paciente` varchar(20) NOT NULL,
  `nome_completo` varchar(100) NOT NULL,
  `email` varchar(30) NOT NULL,
  `senha_hash` varchar(255) NOT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `status_saude` enum('updated','pending','overdue') DEFAULT NULL,
  `tipo_sanguineo` enum('A+','A-','B+','B-','AB+','AB-','O+','O-') DEFAULT NULL,
  `valor_qr` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`cpf_paciente`),
  CONSTRAINT `pacientes_chk_1` CHECK (regexp_like(`cpf_paciente`,_utf8mb4'^[0-9]{11}$'))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pacientes`
--

LOCK TABLES `pacientes` WRITE;
/*!40000 ALTER TABLE `pacientes` DISABLE KEYS */;
INSERT INTO `pacientes` VALUES ('00000000001','Fernando Rocha','Fernando Henrique Rocha','fernando.rocha@email.com','senha123',NULL,'pending','AB-','https://saude.gov.br/passport/000.000.000-01'),('00011122222','Carlos Silva','Carlos Eduardo Silva','carlos.silva@email.com','senha123',NULL,'updated','A+','https://saude.gov.br/passport/000.111.222-22'),('00111223401','Juliana Lima','Juliana Ribeiro Lima','juliana.lima@email.com','senha123',NULL,'updated','AB+','https://saude.gov.br/passport/001.112.234-01'),('11111111111','Beatriz Dias','Beatriz Goncalves Dias','beatriz.dias@email.com','senha123',NULL,'updated','A-','https://saude.gov.br/passport/111.111.111-11'),('11122233344','Mariana Souza','Mariana Costa Souza','mariana.souza@email.com','senha123',NULL,'pending','O-','https://saude.gov.br/passport/111.222.333-44'),('11123423298','Camila Fernandes','Camila Rodrigues Fernandes','camila.fernandes@email.com','senha123',NULL,'updated','O+','https://saude.gov.br/passport/111.234.232-98'),('12312312312','Sofia Mendes','Sofia Castro Mendes','sofia.mendes@email.com','senha123',NULL,'updated','A+','https://saude.gov.br/passport/12312312312'),('12345678900','Roberto Oliveira','Roberto Santos Oliveira','roberto.oliveira@email.com','senha123',NULL,'overdue','B+','https://saude.gov.br/passport/123.456.789-00'),('14235486778','Ricardo Prado','Ricardo Almeida Prado','ricardo.prado@email.com','senha123',NULL,'pending','O+','https://saude.gov.br/passport/142.354.867-78'),('98765432111','Lucas Vieira','Lucas Martins Vieira','lucas.vieira@email.com','senha123',NULL,'overdue','B-','https://saude.gov.br/passport/987.654.321-11');
/*!40000 ALTER TABLE `pacientes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vacinas`
--

DROP TABLE IF EXISTS `vacinas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vacinas` (
  `id_vacina` int NOT NULL AUTO_INCREMENT,
  `paciente_id` char(11) NOT NULL,
  `nome_vacina` varchar(100) DEFAULT NULL,
  `dose` varchar(50) DEFAULT NULL,
  `data_aplicacao` date DEFAULT NULL,
  `status_vacina` enum('pending','applied','overdue') DEFAULT NULL,
  PRIMARY KEY (`id_vacina`,`paciente_id`),
  KEY `paciente_id` (`paciente_id`),
  CONSTRAINT `vacinas_ibfk_1` FOREIGN KEY (`paciente_id`) REFERENCES `pacientes` (`cpf_paciente`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vacinas`
--

LOCK TABLES `vacinas` WRITE;
/*!40000 ALTER TABLE `vacinas` DISABLE KEYS */;
INSERT INTO `vacinas` VALUES (1,'00000000001','Meningocócica B','2ª Dose',NULL,'pending'),(1,'00011122222',' COVID-19 (Pfizer)','3ª Dose - Reforço','2024-02-10','applied'),(1,'00111223401','COVID-19 (Pfizer)','3ª Dose','2024-01-05','applied'),(1,'11111111111','COVID-19 (AstraZeneca)','2ª Dose','2022-08-14','applied'),(1,'11122233344','COVID-19 (Bivalente)','Reforço','2023-11-22','applied'),(1,'11123423298','COVID-19 (Janssen)','Dose Única','2021-11-10','applied'),(1,'12312312312','COVID-19 (Pfizer)','4ª Dose','2024-02-05','applied'),(1,'12345678900','Tétano (dT)','Reforço',NULL,'overdue'),(1,'14235486778','Hepatite A','2ª Dose',NULL,'pending'),(1,'98765432111','Febre Amarela','Dose Única',NULL,'overdue'),(2,'00000000001','Tétano (dT)','Reforço','2022-01-30','applied'),(2,'00011122222','Influenza','Dose Anual','2024-04-15','applied'),(2,'00111223401','Influenza','Dose Anual','2024-05-02','applied'),(2,'11111111111','Influenza','Dose Anual','2024-05-10','applied'),(2,'11122233344','Influenza','Dose Anual',NULL,'pending'),(2,'11123423298','Influenza','Dose Anual','2024-04-18','applied'),(2,'12312312312','Influenza','Dose Anual','2024-05-01','applied'),(2,'12345678900','Febre Amarela','Dose Única','2015-02-14','applied'),(2,'14235486778','Meningocócica ACWY','Dose Única','2023-07-19','applied'),(2,'98765432111','Tríplice Viral','1ª Dose','2023-09-15','applied'),(3,'00011122222','Tríplice Viral','2ª Dose','2023-05-15','applied'),(3,'00111223401','HPV','2ª Dose','2022-09-12','applied'),(3,'11111111111','Tríplice Viral','Reforço','2023-01-11','applied'),(3,'11122233344','Hepatite B','3ª Dose','2024-01-05','applied'),(3,'12312312312','Hepatite B','3ª Dose','2023-12-15','applied');
/*!40000 ALTER TABLE `vacinas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Final view structure for view `historico_vacinal`
--

/*!50001 DROP VIEW IF EXISTS `historico_vacinal`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_0900_ai_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `historico_vacinal` AS select `p`.`nome_paciente` AS `nome_paciente`,`v`.`nome_vacina` AS `nome_vacina`,`v`.`data_aplicacao` AS `data_aplicacao` from (`pacientes` `p` join `vacinas` `v` on((`p`.`cpf_paciente` = `v`.`paciente_id`))) */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-30 19:09:01
