package com.df.mediaassur.Scheduler;

import com.df.mediaassur.service.ExcelService;
import com.df.mediaassur.service.JasperService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.concurrent.atomic.AtomicLong;

@Component
public class MediaAssurSchedulingTask {

    private static final Logger logger = LoggerFactory.getLogger(MediaAssurSchedulingTask.class);
    private static final DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("HH:mm:ss");

    @Autowired
    private ExcelService excelService;

    @Autowired
    private JasperService jasperService;

    private static AtomicLong atomicCounter = new AtomicLong();

    //@Scheduled(fixedRate = 50000)
    public void test() throws NoSuchFieldException, IllegalAccessException, IOException {
        //excelService.treateFile();
        //asperService.generateAttestation(1, "", "jaune");
    }


}





