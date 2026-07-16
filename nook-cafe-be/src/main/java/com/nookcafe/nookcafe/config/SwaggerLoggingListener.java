package com.nookcafe.nookcafe.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Component
public class SwaggerLoggingListener implements ApplicationListener<ApplicationReadyEvent> {

    private static final Logger log = LoggerFactory.getLogger(SwaggerLoggingListener.class);
    private final Environment environment;

    public SwaggerLoggingListener(Environment environment) {
        this.environment = environment;
    }

    @Override
    public void onApplicationEvent(ApplicationReadyEvent event) {
        String port = environment.getProperty("local.server.port");
        if (port == null) {
            port = environment.getProperty("server.port", "8080");
        }
        
        String contextPath = environment.getProperty("server.servlet.context-path", "");
        if ("/".equals(contextPath)) {
            contextPath = "";
        }
        
        String host = "http://localhost:" + port + contextPath;
        
        System.out.println("\n=======================================================================");
        System.out.println("   ☕ Nook Café Backend is running!");
        System.out.println("   📖 OpenAPI JSON Docs:  " + host + "/v3/api-docs");
        System.out.println("   🌐 Interactive Swagger UI: " + host + "/swagger-ui.html");
        System.out.println("=======================================================================\n");
    }
}
