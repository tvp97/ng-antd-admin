package vn.movie.security;

import de.mkammerer.argon2.Argon2;
import de.mkammerer.argon2.Argon2Factory;
import org.springframework.security.crypto.password.PasswordEncoder;

public class Argon2PasswordEncoder implements PasswordEncoder {

    private final Argon2 argon2;

    public Argon2PasswordEncoder() {
        this.argon2 = Argon2Factory.create(Argon2Factory.Argon2Types.ARGON2id);
    }

    @Override
    public String encode(CharSequence rawPassword) {
        // Use matching params as nestjs: default argon2id, 1 iteration, 4 parallelism (rough equivalent or default)
        // Usually 10 iterations, 65536 memory, 1 thread
        return argon2.hash(10, 65536, 1, rawPassword.toString().toCharArray());
    }

    @Override
    public boolean matches(CharSequence rawPassword, String encodedPassword) {
        return argon2.verify(encodedPassword, rawPassword.toString().toCharArray());
    }
}
