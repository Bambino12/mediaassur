package com.df.mediaassur.service;


import com.df.mediaassur.exception.FileStorageException;
import com.df.mediaassur.exception.MyFileNotFoundException;
import com.df.mediaassur.property.FileStorageProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.xml.bind.DatatypeConverter;
import java.io.*;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;


@Service
public class FileStorageService {

    private  Path fileStorageLocation;
    private String fullDirName = null;
    private String baseDirName = null;

    private static final Logger logger = LoggerFactory.getLogger(FileStorageService.class);

    @Autowired
    public FileStorageService(FileStorageProperties fileStorageProperties) {
        baseDirName=fileStorageProperties.getUploadDir();
        setDirName(baseDirName);
    }

    public void setDirName(String fileDirName) {

        if(fullDirName != null)
            this.fullDirName =  baseDirName + "/" + fileDirName;
        else
            this.fullDirName =  fileDirName;

        setFileStorageLocation();
    }

    public void setDirName() {
        this.fullDirName =  baseDirName ;
        setFileStorageLocation();
    }

    public String getDirName() {
        return this.fullDirName;
    }

    public Path getFileStorageLocation() {
        return fileStorageLocation;
    }

    public void setFileStorageLocation() {
        //this.fileStorageLocation = fileStorageLocation;
        this.fileStorageLocation = Paths.get(getDirName())
                .toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new FileStorageException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }


    public boolean deleteRessourceFile(String fileName, String folder) {
        try {
            this.setDirName(folder);
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if(resource.exists()) {
                return  resource.getFile().delete();
            } else {
                //appLogService.save(new AppLog("Erreur lors de la suppression d'une photo ", fileName  + " fichier introuvable", fileName  + " fichier introuvable", AppConstants.STATUS_APP_LOG_ERROR));
                throw new MyFileNotFoundException("File not found " + fileName);
            }
        } catch (MalformedURLException ex) {
            //appLogService.save(new AppLog("Erreur lors de la suppression d'une photo ", ex.getMessage(), ex.getStackTrace().toString(), AppConstants.STATUS_APP_LOG_ERROR));
            //throw new MyFileNotFoundException("File not found " + fileName, ex);
        } catch (IOException e) {
            //appLogService.save(new AppLog("Erreur lors de la suppression d'une photo ", e.getMessage(), e.getStackTrace().toString(), AppConstants.STATUS_APP_LOG_ERROR));
            e.printStackTrace();
        }

        return false;
    }


    public boolean renameRessourceFile(String fileName, String newFileName,  String folder) {
        try {
            this.setDirName(folder);
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            Path newFilePath = this.fileStorageLocation.resolve(newFileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if(resource.exists()) {

               boolean isrenamed =  resource.getFile().renameTo(new File(newFileName));

                if(!isrenamed){
                    Files.move(filePath, newFilePath,StandardCopyOption.REPLACE_EXISTING);
                }

            } else {
                logger.info("File don't exist in folder");
                //appLogService.save(new AppLog("Erreur lors de la renommage d'une photo ", fileName  + " fichier introuvable", fileName  + " fichier introuvable", AppConstants.STATUS_APP_LOG_ERROR));
                throw new MyFileNotFoundException("File not found " + fileName);
            }
        } catch (MalformedURLException ex) {
            ex.printStackTrace();
            //appLogService.save(new AppLog("Erreur lors du renommage  d'une photo ", ex.getMessage(), ex.getStackTrace().toString(), AppConstants.STATUS_APP_LOG_ERROR));
            throw new MyFileNotFoundException("File not found " + fileName, ex);
        } catch (IOException e) {
            //appLogService.save(new AppLog("Erreur lors du renommage d'une photo ", e.getMessage(), e.getStackTrace().toString(), AppConstants.STATUS_APP_LOG_ERROR));
            e.printStackTrace();
        }

        return false;
    }

   /* //@Autowired
    public FileStorageService(FileStorageProperties fileStorageProperties) {
        this.fileStorageLocation = Paths.get(fileStorageProperties.getUploadDir())
                .toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new FileStorageException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }*/

    public String storeFile(MultipartFile file) {
        // Normalize file name
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());

        try {
            // Check if the file's name contains invalid characters
            if(fileName.contains("..")) {
                throw new FileStorageException("Sorry! Filename contains invalid path sequence " + fileName);
            }

            // Copy file to the target location (Replacing existing file with the same name)
            Path targetLocation = this.fileStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return fileName;
        } catch (IOException ex) {
            //appLogService.save(new AppLog("Erreur lors de l'enregistrement d'une photo ", ex.getMessage(), ex.getStackTrace().toString(), AppConstants.STATUS_APP_LOG_ERROR));
            throw new FileStorageException("Could not store file " + fileName + ". Please try again!", ex);
        }
    }

    public String storeFile(MultipartFile file, String fileName) {
        // Normalize file name
        // String fileName = StringUtils.cleanPath(file.getOriginalFilename());

        try {

            // Check if the file's name contains invalid characters or has an extensions
           String[] extensions = Objects.requireNonNull(file.getOriginalFilename()).split("\\.");
           if(fileName.contains("..") || fileName.contains(".") || extensions.length==0) {
                throw new FileStorageException("Sorry! Filename contains invalid path sequence " + fileName);
            }

            // Copy file to the target location (Replacing existing file with the same name)
            fileName = fileName + "." + extensions[extensions.length -1].trim().replaceAll(" ", "");
            Path targetLocation = this.fileStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return fileName;
        } catch (IOException ex) {
            //appLogService.save(new AppLog("Erreur lors de l'enregistrement d'une photo ", ex.getMessage(), ex.getStackTrace().toString(), AppConstants.STATUS_APP_LOG_ERROR));
            throw new FileStorageException("Could not store file " + fileName + ". Please try again!", ex);
        }
    }

    public Resource loadFileAsResource(String fileName) {
        try {
            Path filePath = this.fileStorageLocation.resolve(fileName).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if(resource.exists()) {
                return resource;
            } else {
                throw new MyFileNotFoundException("File not found " + fileName);
            }
        } catch (MalformedURLException ex) {
            throw new MyFileNotFoundException("File not found " + fileName, ex);
        }
    }

  public String convertBase64ToImage(String fileName, String base64, String folder) {
      //convert base64 string to binary data
      String fileNameExtension = fileName;
      byte[] data = DatatypeConverter.parseBase64Binary(base64);
      this.setDirName(folder);
      Path targetLocation = this.fileStorageLocation.resolve(fileNameExtension);
              //"C:\\Users\\Ene\\Desktop\\test_image." + extension;

      File file = new File(targetLocation.toString());
      try (OutputStream outputStream = new BufferedOutputStream(new FileOutputStream(file))) {
          outputStream.write(data);
      } catch (IOException e) {
          //appLogService.save(new AppLog("Erreur lors de la convertion de la photo de base64 en png ", e.getMessage(), e.getStackTrace().toString(), AppConstants.STATUS_APP_LOG_ERROR));
          fileNameExtension = base64;
          e.printStackTrace();
      }

      return fileNameExtension;
  }

}
