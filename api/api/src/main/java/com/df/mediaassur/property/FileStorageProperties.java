package com.df.mediaassur.property;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "file")
public class FileStorageProperties {

    /*private String uploadDir;
    public String getUploadDir() {
        return uploadDir;
    }
    public void setUploadDir(String uploadDir) {
        this.uploadDir = uploadDir;
    }*/

    private String uploadDir;

    public String getUploadDir() {
        System.out.println("eeeeeee " + uploadDir);
        return uploadDir;
    }

    public String getUploadDir(String dirName) {
        //System.out.println("ddddddd " + uploadDir + "/" + dirName);
        ///System.out.println(uploadDir);
        return uploadDir + "/" + dirName;
    }

    public void setUploadDir(String uploadDir) {
        this.uploadDir = uploadDir;
    }

}
