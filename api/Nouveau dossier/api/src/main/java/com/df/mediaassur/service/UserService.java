package com.df.mediaassur.service;
import com.df.mediaassur.model.User;
import com.df.mediaassur.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {


    @Autowired
   private UserRepository userRepository;


    public List<User> getAll(){
        return userRepository.findAll();
    }
}
