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
  `telefone` varchar(20) DEFAULT NULL,
  `senha` varchar(255) NOT NULL,
  `nome_usuario` varchar(100) NOT NULL,
  PRIMARY KEY (`idUsuario`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `nome_usuario` (`nome_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Fernanda','fernanda@gmail','45666666666','123456','fernanda56789'),(2,'Leticia','leticia@gmail.com','45 777777777','123456','leticia123'),(3,'Jose','jose@gmail','45 33333333','234567','jose1234'),(4,'Nathaly','nathaly@gmail.com','45 88888888','345678','nathaly1234'),(5,'Stefany','stefany@gmail.com','45 799999999','456789','stefany123456'),(6,'Thales','thales@gmail.com','777777777777','67890123','thales1234'),(7,'Junior','junior@gmail.com','459999999999','78901234','junior1234'),(9,'Isabela','isabela@gmail.com','45 7777777777','7890123','isabela1234'),(10,'Neusa','neusa@gmail.com','453333333333','9123456','neusa1234'),(11,'Bianca','bianca@gmail.com','45 666666666666','56789012','bianca123'),(12,'Sol','sol@gmail.com','45 77777777','345678','sol1234'),(13,'Bel','bel@gmail.com','45 666666666','3456789','bel123456'),(14,'John','john@gmail.com','45 8888888888','234567','john123456'),(15,'Kiara','kiara@gmail.com','457777','12345','kiara123'),(18,'Hanna','hanna@gmail','45 888888','123456','hanna123456'),(19,'Fred','fred@gmail.com','457777777','1234567','fred12345'),(21,'Vanessa','vanessa@gmail.com','66666','45678','vanessa123'),(22,'Vinicius','vinicius@gmail','33333333','1234','vini123'),(24,'Fabricio','fabricio@gmail','33333333','123456','fabricio1234'),(25,'Andre','andre@gmail','666777','123456','andre123'),(26,'Andre','Annnndre@gmail','666666666','123456','andre123555'),(27,'Bingo','BINGO@GMAIL.COM','3333333333333','123456','bingo1234'),(28,'Fernanda Bertotti','FERNANDA@GMAIL.COM','6666666666666','123456','fer1234'),(29,'Fernanda Bertotti','fernanda6666@gmail.com','45999619618','123456','FER12222'),(30,'Fernanda Bertotti','fefe@gmail.com','45999619618','[object Promise]','FER125'),(31,'João','joao@gmail.com','333333333','[object Promise]','joao123'),(32,'Noah ','noah@gmail.com','22222222222','[object Promise]','noah123'),(33,'Taylor','taylor@gmail.com','33333333','[object Promise]','taylor1234'),(34,'Olivia','olivia@gmail.com','444444444444','$2b$10$uLGapokEnbATTLGWReSJcebHo2u0HVEQBdJpQXTnx4b4gTqAWyxTi','olivia123'),(35,'Bibi','bibi@gmail.com','3333333333','$2b$10$gIeuejVPQFQdjGvgW0OIkOgOxzn.5heM2Um1VulmB8rtP1BHmBv6W','bibi123'),(36,'usuario','usuario@gmail.com','4444777','$2b$10$WSmfqzGy3xstW5UkO0u2UeanjFNP3oe2BNcgV1LyH5ltRSpFmdc.u','usuario123456'),(37,'usuario2','ususu@gmail.com','55555555555555','$2b$10$P.lI1zt6duXG3yGeizoVpudIyppPQHoZRU8xB8Fqdjri.G43HY9Ma','usuario234567');
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

-- Dump completed on 2026-08-06  1:50:07
