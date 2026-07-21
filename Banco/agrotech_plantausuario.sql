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
-- Table structure for table `plantausuario`
--

DROP TABLE IF EXISTS `plantausuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `plantausuario` (
  `idPlanta` int NOT NULL AUTO_INCREMENT,
  `nomePlanta` enum('morango','tomate','pepino','cenoura') NOT NULL,
  `quantidade` int NOT NULL,
  `localizacao` varchar(100) NOT NULL,
  `data_plantacao` date NOT NULL,
  `agrotoxico` enum('sim','nao') NOT NULL,
  PRIMARY KEY (`idPlanta`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plantausuario`
--

LOCK TABLES `plantausuario` WRITE;
/*!40000 ALTER TABLE `plantausuario` DISABLE KEYS */;
INSERT INTO `plantausuario` VALUES (1,'morango',33,'Medianeira','2026-07-18','sim'),(2,'pepino',4,'Medianeira','2026-07-19','nao'),(3,'morango',5,'Medianeira','2026-07-21','sim'),(4,'morango',33,'Medianeira','2026-07-19','sim'),(5,'morango',33,'Medianeira','2026-07-19','sim'),(6,'morango',33,'Medianeira','2026-07-19','sim'),(7,'morango',33,'Medianeira','2026-07-13','sim'),(8,'morango',33,'Medianeira','2026-07-19','sim'),(9,'morango',33,'Medianeira','2026-07-19','sim'),(10,'pepino',33,'Medianeira','2026-07-19','sim'),(11,'tomate',33,'Medianeira','2026-07-19','sim'),(12,'cenoura',33,'Medianeira','2026-07-19','sim'),(13,'morango',33,'Medianeira','2026-07-22','sim'),(14,'tomate',5,'Medianeira','2026-07-20','sim');
/*!40000 ALTER TABLE `plantausuario` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-20 16:10:57
