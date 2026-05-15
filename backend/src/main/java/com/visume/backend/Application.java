package com.visume.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.visume.backend.config.DotenvLoader;

@SpringBootApplication
public class Application {

	public static void main(String[] args) {
		DotenvLoader.loadIfPresent();
		SpringApplication.run(Application.class, args);
	}

}
