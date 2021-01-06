
START TRANSACTION;
SET FOREIGN_KEY_CHECKS=0;

--
-- Estrutura da tabela `teste_default_times`
--

DROP TABLE IF EXISTS `teste_default_times`;
CREATE TABLE IF NOT EXISTS `teste_default_times` (
  `id` int(11) NOT NULL,
  `weekday` int(11) NOT NULL,
  `name` varchar(60) COLLATE utf8mb4_spanish_ci NOT NULL,
  `time_in` int(11) NOT NULL,
  `time_out` int(11) NOT NULL,
  PRIMARY KEY (`id`,`weekday`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

INSERT INTO `teste_default_times` (`id`, `weekday`, `name`, `time_in`, `time_out`) VALUES
(1001, 1, 'Padrão Obra', 420, 1020),
(1001, 2, 'Padrão Obra', 420, 1020),
(1001, 3, 'Padrão Obra', 420, 1020),
(1001, 4, 'Padrão Obra', 420, 1020),
(1001, 5, 'Padrão Obra', 420, 960);
-- --------------------------------------------------------

--
-- Estrutura da tabela `teste_employers`
--

DROP TABLE IF EXISTS `teste_employers`;
CREATE TABLE IF NOT EXISTS `teste_employers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(60) COLLATE utf8mb4_spanish_ci NOT NULL,
  `job` varchar(60) COLLATE utf8mb4_spanish_ci NOT NULL,
  `default_time` int(11) NOT NULL,
  `place` int(11) NOT NULL DEFAULT 1020,
  `disabled_at` int(11) DEFAULT NULL,
  `disabled_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `place` (`place`),
  KEY `default_time` (`default_time`),
  KEY `disabled_by` (`disabled_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `teste_employers_transfers`
--

DROP TABLE IF EXISTS `teste_employers_transfers`;
CREATE TABLE IF NOT EXISTS `teste_employers_transfers` (
  `employer_id` int(11) NOT NULL,
  `from_place` int(11) NOT NULL,
  `to_place` int(11) NOT NULL,
  `transfered_at` int(11) NOT NULL,
  `transfered_by` int(11) NOT NULL,
  PRIMARY KEY (`employer_id`,`transfered_at`),
  KEY `from_place` (`from_place`),
  KEY `to_place` (`to_place`),
  KEY `transfered_by` (`transfered_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `teste_holidays`
--

DROP TABLE IF EXISTS `teste_holidays`;
CREATE TABLE IF NOT EXISTS `teste_holidays` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` varchar(10) COLLATE utf8mb4_spanish_ci NOT NULL,
  `name` varchar(60) COLLATE utf8mb4_spanish_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

INSERT INTO `rionorte_holidays` (`date`, `name`) VALUES
('01-01', 'Ano Novo'),
('12-25', 'Natal'),
('11-02', 'Finados'),
('04-21', 'Tiradentes'),
('05-01', 'Dia do Trabalho'),
('09-07', 'Independência do Brasil'),
('10-12', 'Nossa Sra. Aparecida'),
('11-15', 'Proclamação da República'),
('04-23', 'Dia de São Jorge');
-- --------------------------------------------------------

--
-- Estrutura da tabela `teste_marks`
--

DROP TABLE IF EXISTS `teste_marks`;
CREATE TABLE IF NOT EXISTS `teste_marks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `employer_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time_in` int(4) NOT NULL,
  `time_out` int(4) NOT NULL,
  `time_before` int(4) DEFAULT NULL,
  `time_after` int(4) DEFAULT NULL,
  `weekday` tinyint(1) DEFAULT NULL,
  `holiday` tinyint(1) DEFAULT NULL,
  `created_at` int(11) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `comment` varchar(200) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `commented_at` int(11) DEFAULT NULL,
  `commented_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `employer_id` (`employer_id`,`date`),
  KEY `commented_by` (`commented_by`),
  KEY `created_by` (`created_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `teste_marks_history`
--

DROP TABLE IF EXISTS `teste_marks_history`;
CREATE TABLE IF NOT EXISTS `teste_marks_history` (
  `id` int(11) NOT NULL,
  `employer_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `time_in` int(4) NOT NULL,
  `time_out` int(4) NOT NULL,
  `time_before` int(4) DEFAULT NULL,
  `time_after` int(4) DEFAULT NULL,
  `weekday` tinyint(1) DEFAULT NULL,
  `holiday` tinyint(1) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `created_by` int(11) NOT NULL,
  `comment` varchar(200) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `commented_at` int(11) DEFAULT NULL,
  `commented_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`,`created_at`),
  KEY `commented_by` (`commented_by`),
  KEY `created_by` (`created_by`),
  KEY `employer_id` (`employer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `teste_places`
--

DROP TABLE IF EXISTS `teste_places`;
CREATE TABLE IF NOT EXISTS `teste_places` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(60) COLLATE utf8mb4_spanish_ci NOT NULL,
  `state` varchar(2) COLLATE utf8mb4_spanish_ci DEFAULT NULL,
  `disabled_at` int(11) DEFAULT NULL,
  `disabled_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  KEY `disabled_by` (`disabled_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `teste_users`
--

DROP TABLE IF EXISTS `teste_users`;
CREATE TABLE IF NOT EXISTS `teste_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(60) COLLATE utf8mb4_spanish_ci NOT NULL,
  `user_type` varchar(10) COLLATE utf8mb4_spanish_ci NOT NULL,
  `created_by` int(11) NOT NULL,
  `created_at` int(11) NOT NULL,
  `refresh_token` varchar(10) COLLATE utf8mb4_spanish_ci NOT NULL,
  `disabled_at` int(11) DEFAULT NULL,
  `disabled_by` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `disabled_by` (`disabled_by`),
  KEY `created_by` (`created_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

INSERT INTO `teste_users` (`id`, `name`, `user_type`, `created_by`, `created_at`, `refresh_token`, `disabled_at`,`disabled_by`) 
VALUES 
(1001, 'MAYCON', 'admin', 0, 0, 0, NULL, NULL), 
(1002, 'MARCADOR', 'marker', 0, 0, 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Estrutura da tabela `teste_users_accesses`
--

DROP TABLE IF EXISTS `teste_users_accesses`;
CREATE TABLE IF NOT EXISTS `teste_users_accesses` (
  `user_id` int(11) NOT NULL,
  `place_id` int(11) NOT NULL,
  UNIQUE KEY `user_id` (`user_id`,`place_id`),
  KEY `place_id` (`place_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_spanish_ci;

--
-- Restrições para despejos de tabelas
--

--
-- Limitadores para a tabela `teste_employers`
--
ALTER TABLE `teste_employers`
  ADD CONSTRAINT `teste_employers_ibfk_1` FOREIGN KEY (`place`) REFERENCES `teste_places` (`id`),
  ADD CONSTRAINT `teste_employers_ibfk_2` FOREIGN KEY (`default_time`) REFERENCES `teste_default_times` (`id`),
  ADD CONSTRAINT `teste_employers_ibfk_3` FOREIGN KEY (`disabled_by`) REFERENCES `teste_users` (`id`);

--
-- Limitadores para a tabela `teste_employers_transfers`
--
ALTER TABLE `teste_employers_transfers`
  ADD CONSTRAINT `teste_employers_transfers_ibfk_5` FOREIGN KEY (`employer_id`) REFERENCES `teste_employers` (`id`),
  ADD CONSTRAINT `teste_employers_transfers_ibfk_6` FOREIGN KEY (`from_place`) REFERENCES `teste_places` (`id`),
  ADD CONSTRAINT `teste_employers_transfers_ibfk_7` FOREIGN KEY (`to_place`) REFERENCES `teste_places` (`id`),
  ADD CONSTRAINT `teste_employers_transfers_ibfk_8` FOREIGN KEY (`transfered_by`) REFERENCES `teste_users` (`id`);

--
-- Limitadores para a tabela `teste_marks`
--
ALTER TABLE `teste_marks`
  ADD CONSTRAINT `teste_marks_ibfk_1` FOREIGN KEY (`employer_id`) REFERENCES `teste_employers` (`id`),
  ADD CONSTRAINT `teste_marks_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `teste_users` (`id`),
  ADD CONSTRAINT `teste_marks_ibfk_3` FOREIGN KEY (`commented_by`) REFERENCES `teste_users` (`id`);

--
-- Limitadores para a tabela `teste_marks_history`
--
ALTER TABLE `teste_marks_history`
  ADD CONSTRAINT `teste_marks_history_ibfk_1` FOREIGN KEY (`commented_by`) REFERENCES `teste_users` (`id`),
  ADD CONSTRAINT `teste_marks_history_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `teste_users` (`id`),
  ADD CONSTRAINT `teste_marks_history_ibfk_3` FOREIGN KEY (`employer_id`) REFERENCES `teste_employers` (`id`),
  ADD CONSTRAINT `teste_marks_history_ibfk_4` FOREIGN KEY (`id`) REFERENCES `teste_marks` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Limitadores para a tabela `teste_places`
--
ALTER TABLE `teste_places`
  ADD CONSTRAINT `teste_places_ibfk_1` FOREIGN KEY (`disabled_by`) REFERENCES `teste_users` (`id`);

--
-- Limitadores para a tabela `teste_users`
--
ALTER TABLE `teste_users`
  ADD CONSTRAINT `teste_users_ibfk_1` FOREIGN KEY (`disabled_by`) REFERENCES `teste_users` (`id`),
  ADD CONSTRAINT `teste_users_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `teste_users` (`id`);

--
-- Limitadores para a tabela `teste_users_accesses`
--
ALTER TABLE `teste_users_accesses`
  ADD CONSTRAINT `teste_users_accesses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `teste_users` (`id`),
  ADD CONSTRAINT `teste_users_accesses_ibfk_2` FOREIGN KEY (`place_id`) REFERENCES `teste_places` (`id`);


SET FOREIGN_KEY_CHECKS=0;
COMMIT;

