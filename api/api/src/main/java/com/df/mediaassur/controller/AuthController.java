package com.df.mediaassur.controller;

import com.df.mediaassur.exception.AppException;
import com.df.mediaassur.model.Assureur;
import com.df.mediaassur.model.Role;
import com.df.mediaassur.model.RoleName;
import com.df.mediaassur.payload.*;
import com.df.mediaassur.repository.RoleRepository;
import com.df.mediaassur.repository.UserRepository;
import com.df.mediaassur.model.User;
import com.df.mediaassur.security.JwtTokenProvider;
import com.df.mediaassur.security.UserPrincipal;
import com.df.mediaassur.util.AppConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.validation.Valid;
import java.net.URI;
import java.util.Collections;

/**
 *
 * Created by rajeevkumarsingh on 02/08/17.
 */
@RestController
@RequestMapping("/v1/auth")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    JwtTokenProvider tokenProvider;

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

        try {

            logger.info("_______" + loginRequest.getUsernameOrEmail().toLowerCase());

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsernameOrEmail().toLowerCase(),
                            loginRequest.getPassword()
                    )
            );

            //logger.info(authentication.getName());

            SecurityContextHolder.getContext().setAuthentication(authentication);


            UserPrincipal userP = (UserPrincipal) authentication.getPrincipal();

            String jwt = tokenProvider.generateToken(authentication);

            logger.info("user below logged successfully .....");
            logger.info(userP.getUsername());

            return ResponseEntity.ok(new JwtAuthenticationResponse(AppConstants.STATUS_CODE_SUCCESS, jwt, userP.getName(),  userP.getEmail()));
            //new ResponseEntity(new ApiResponse(AppConstants.STATUS_CODE_SUCCESS[0], true, AppConstants.STATUS_CODE_SUCCESS[1]), HttpStatus.OK);

        }
        catch(Exception e) {
            e.printStackTrace();
            return new ResponseEntity(new ApiResponse(AppConstants.STATUS_CODE_BAD_CREDENTIALS, false, "Login et mot passe incorrect"),
                    HttpStatus.UNAUTHORIZED);
        }

    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {

        if(userRepository.existsByUsername(signUpRequest.getUsername())) {
            return new ResponseEntity(new ApiResponse(false, "Username is already taken!"),
                    HttpStatus.BAD_REQUEST);
        }

        if(userRepository.existsByEmail(signUpRequest.getEmail())) {
            return new ResponseEntity(new ApiResponse(false, "Email Address already in use!"),
                    HttpStatus.BAD_REQUEST);
        }

        // Creating user's account
        User user = new User(signUpRequest.getName(), signUpRequest.getUsername(),
                signUpRequest.getEmail(), signUpRequest.getPassword());

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        Role userRole = roleRepository.findByName(RoleName.ROLE_USER)
                .orElseThrow(() -> new AppException("User Role not set."));

        user.setRoles(Collections.singleton(userRole));

        User result = userRepository.save(user);

        URI location = ServletUriComponentsBuilder
                .fromCurrentContextPath().path("/users/{username}")
                .buildAndExpand(result.getUsername()).toUri();

        return ResponseEntity.created(location).body(new ApiResponse(true, "User registered successfully"));
    }

}
