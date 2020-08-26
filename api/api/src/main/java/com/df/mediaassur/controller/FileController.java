package com.df.mediaassur.controller;

import com.df.mediaassur.model.Attestation;
import com.df.mediaassur.payload.LotUploadFileResponse;
import com.df.mediaassur.payload.UploadFileResponse;
import com.df.mediaassur.service.ExcelService;
import com.df.mediaassur.service.FileStorageService;
import com.df.mediaassur.util.AppConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.servlet.http.HttpServletRequest;
import java.awt.*;
import java.io.IOException;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

/** Created by zola on 20/11/17. */

@RestController
@RequestMapping("/v1/files")
public class FileController {

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private Environment env;

    @Autowired
    private ExcelService excelService;

    private static final Logger logger = LoggerFactory.getLogger(FileController.class);

    @PostMapping("/uploadExcelFile")
    public LotUploadFileResponse uploadFileWithName(@RequestParam("file") MultipartFile file) throws IOException {

        String fileName = String.valueOf(new Date().getTime());

        System.out.println("fileName ====>>> " + fileName);

        fileStorageService.setDirName(AppConstants.FOLDER_EXCEL_UPLOAD);
        //fileStorageService.setFileStorageLocation();
        fileName = fileStorageService.storeFile(file, fileName);

        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/v1/files/get/" + AppConstants.FOLDER_EXCEL_UPLOAD + "/")
                .path(fileName)
                .toUriString();

       return new LotUploadFileResponse(fileName, fileDownloadUri, file.getContentType(), file.getSize(),
               excelService.treateFile(env.getProperty("file.upload-dir") + "/" + AppConstants.FOLDER_EXCEL_UPLOAD + "/" + fileName));
    }

    @PostMapping("/uploadFileWithName")
    public UploadFileResponse uploadFileWithName(@RequestParam("file") MultipartFile file, @RequestParam("name") String fileName, @RequestParam("dir") String dirName) {

        System.out.println("fileName ====>>> " + fileName);

        fileStorageService.setDirName(dirName);
        //fileStorageService.setFileStorageLocation();
        fileName = fileStorageService.storeFile(file, fileName);

        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/downloadFile/")
                .path(fileName)
                .toUriString();

        return new UploadFileResponse(fileName, fileDownloadUri, file.getContentType(), file.getSize());
    }

    @PostMapping("/upload")
    public UploadFileResponse uploadFile(@RequestParam("file") MultipartFile file) {
        String fileName = fileStorageService.storeFile(file);

        String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/file/downloadFile/")
                .path(fileName)
                .toUriString();

        return new UploadFileResponse(fileName, fileDownloadUri,
                file.getContentType(), file.getSize());
    }

    @PostMapping("/uploadMultiple")
    public List<UploadFileResponse> uploadMultipleFiles(@RequestParam("files") MultipartFile[] files) {
        return Arrays.asList(files)
                .stream()
                .map(file -> uploadFile(file))
                .collect(Collectors.toList());
    }

    @GetMapping("/get/{dirName}/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile2(@PathVariable String dirName, @PathVariable String fileName, HttpServletRequest request) {
        // Load file as Resource
        fileStorageService.setDirName(dirName);
        Resource resource = fileStorageService.loadFileAsResource(fileName);

        // Try to determine file's content type
        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException ex) {
            logger.info("Could not determine file type.");
        }

        // Fallback to the default content type if type could not be determined
        if(contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

    @GetMapping("/get/{fileName:.+}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String fileName, HttpServletRequest request) {

        // Load file as Resource
        Resource resource = fileStorageService.loadFileAsResource(fileName);

        // Try to determine file's content type
        String contentType = null;
        try {
            contentType = request.getServletContext().getMimeType(resource.getFile().getAbsolutePath());
        } catch (IOException ex) {
            logger.info("Could not determine file type.");
        }

        // Fallback to the default content type if type could not be determined
        if(contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                .body(resource);
    }

}
