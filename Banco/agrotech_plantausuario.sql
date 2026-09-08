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
  `idUsuario` int NOT NULL,
  `planta` varchar(45) NOT NULL,
  `tipoPlanta` varchar(100) NOT NULL,
  `safraNumero` int NOT NULL,
  `safraNome` varchar(300) DEFAULT NULL,
  `quantidade` int NOT NULL,
  `longitude` varchar(100) NOT NULL,
  `latitude` varchar(100) NOT NULL,
  `data_plantacao` date NOT NULL,
  `agrotoxico` enum('sim','nao') NOT NULL,
  `comentarios` text,
  PRIMARY KEY (`idPlanta`),
  KEY `idUsuario` (`idUsuario`),
  CONSTRAINT `plantausuario_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios` (`idUsuario`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plantausuario`
--

LOCK TABLES `plantausuario` WRITE;
/*!40000 ALTER TABLE `plantausuario` DISABLE KEYS */;
INSERT INTO `plantausuario` VALUES (14,36,'morango','tipomora1',1,'Tipomora1 safra 1',99,'-54.083290997328376','-25.29902778772482','2026-09-24','sim',NULL),(16,36,'cenoura','tipoceno3',1,'tipoceno3 safra 1',8986,'-54.083286','-25.299034000000002','2026-09-30','nao',NULL),(17,36,'tomate','tipotom2',1,'tipotom2 safra 1',8986,'-54.083286','-25.299034000000002','2026-09-29','nao','Anotacao'),(18,36,'morango','tipomora1',2,'tipomora1 safra 2',8986,'-54.083286','-25.299034000000002','2026-10-03','nao',NULL),(19,36,'morango','tipomora2',1,'tipomora2 safra 1',8986,'-54.083286','-25.299032','2026-09-08','sim',NULL);
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

-- Dump completed on 2026-09-08 13:30:57
