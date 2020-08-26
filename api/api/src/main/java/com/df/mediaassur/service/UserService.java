package com.df.mediaassur.service;
import com.df.mediaassur.model.Assure;
import com.df.mediaassur.model.User;
import com.df.mediaassur.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
   private UserRepository userRepository;


    public List<User> getAll(){
        return userRepository.findAll();
    }

    public Boolean update(User user) {
        try {
            Optional<User> user1 =userRepository.findByUsername(user.getUsername());

            if (user1.isPresent()){

                User exitUser = user1.get();

                exitUser.setName(user.getName());
                exitUser.setPassword(passwordEncoder.encode(user.getPassword()));

                userRepository.save(exitUser);
            }
            user = userRepository.save(user);
            //System.out.println(repas.toString());
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
