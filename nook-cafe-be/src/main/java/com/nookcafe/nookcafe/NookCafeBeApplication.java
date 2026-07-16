package com.nookcafe.nookcafe;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class NookCafeBeApplication {

    public static void main(String[] args) {
        SpringApplication.run(NookCafeBeApplication.class, args);
    }

}
