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
  `longitude` decimal(9,6) NOT NULL,
  `latitude` decimal(9,6) NOT NULL,
  `data_plantacao` date NOT NULL,
  `agrotoxico` enum('sim','nao') NOT NULL,
  `comentarios` text,
  `url` varchar(500) DEFAULT NULL,
  PRIMARY KEY (`idPlanta`),
  KEY `idUsuario` (`idUsuario`),
  CONSTRAINT `plantausuario_ibfk_1` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios` (`idUsuario`),
  CONSTRAINT `chk_quantidade_positiva` CHECK ((`quantidade` > 0))
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plantausuario`
--

LOCK TABLES `plantausuario` WRITE;
/*!40000 ALTER TABLE `plantausuario` DISABLE KEYS */;
INSERT INTO `plantausuario` VALUES (1,1,'tomate','tomateCereja',1,'tomateCereja safra 1',8986,-54.083227,-25.299201,'2026-10-16','sim',NULL,NULL),(2,1,'cenoura','cenouraTradicional',1,'cenouraTradicional safra 1',34,-54.083227,-25.299201,'2026-10-28','sim','funcionaaaa','https://res.cloudinary.com/iucjf5bn/image/upload/v1791404161/lyh7azxbgwl2xrpebvex.png'),(3,1,'tomate','tomateCereja',2,'tomateCereja safra 2',34,-54.083227,-25.299201,'2026-10-03','sim',NULL,NULL);
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

-- Dump completed on 2026-10-07 17:17:31
