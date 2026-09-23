-- MySQL dump 10.13  Distrib 8.0.46, for Win64 (x86_64)
--
-- Host: localhost    Database: agrotech
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
-- Table structure for table `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `idUsuario` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `telefone` varchar(20) NOT NULL,
  `senha` varchar(255) NOT NULL,
  `nome_usuario` varchar(100) NOT NULL,
  `role` varchar(45) NOT NULL,
  PRIMARY KEY (`idUsuario`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `nome_usuario` (`nome_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (34,'Olivia','olivia@gmail.com','444444444444','$2b$10$uLGapokEnbATTLGWReSJcebHo2u0HVEQBdJpQXTnx4b4gTqAWyxTi','olivia123','user'),(35,'Bibi','bibi@gmail.com','3333333333','$2b$10$gIeuejVPQFQdjGvgW0OIkOgOxzn.5heM2Um1VulmB8rtP1BHmBv6W','bibi123','user'),(36,'usuario','usuario@gmail.com','44447','$2b$10$WSmfqzGy3xstW5UkO0u2UeanjFNP3oe2BNcgV1LyH5ltRSpFmdc.u','usuario1234','user'),(37,'usuario2','ususu@gmail.com','55555555555555','$2b$10$P.lI1zt6duXG3yGeizoVpudIyppPQHoZRU8xB8Fqdjri.G43HY9Ma','usuario234567','user'),(38,'usario3','usuario3@gmail.com','44444444444','$2b$10$ZOVekt4LvMgRJvqj0WFCaON0YnrruFufB4sQlfBw3U0qkfA5CqxAW','usuariominha senha','user'),(39,'Admin','admin@gmail','54564665','$2b$10$IdbkGjYr2fsJ0IuTB1DL2eFkk8/z.V4BAm6CVzGMHubIea9RIzidu','admin123','adm'),(41,'usua4','usu@gmail','77777777777','$2b$10$4vrj.0tvjZDdxKK9rsr4u.9puR5uCnMrjCMX0OD/aKwClZPRVgCpy','123456','user'),(44,'Fernanda Bertotti','fernandabertotti7@gmail.com','555555','$2b$10$jGozq55Wn7Zz1DBIUlMEfOpPXYmzRs0QSAJGQId/3iUJqr1AtaP0y','fernanda123','user'),(45,'Bel','bel@gmail.com','333333333333','$2b$10$jKKfXyJ2zNn60woMERrG.OSfD2wvxXoZGn8LTSxGDON8VfEtNa.zu','bel123456','user'),(46,'Bianca','bianca@gmail.com','4444444444','$2b$10$TnVbUbmprt9SOEflJkjU4e3OXwDIY8PscY.Tpt63njoskgP3gU.Xy','bianca123','user'),(47,'leticia','leticia@gmail.com','345678','$2b$10$2e6K4T5sfIZQD5GAC7NMOek6L8uZSo3yhceP05WFkHpVE6E5NM8d6','leticia','user'),(48,'fernanda','fernanda@gmail.com','234567','$2b$10$pK6mITpojK8Qv4YMcvt0RO6twp657uvxUBhwqKZrX3sSJTjeb8jSi','fer','user');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-23 11:55:23
