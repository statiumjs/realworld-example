export const initialize = async ({ $get, $set }) => {
    let user = $get('user');
    
    await $set({
        image: user.image || '',
        username: user.username || '',
        bio: user.bio || '',
        email: user.email || '',
        busy: false,
    });
};

export const submit = async ({ $get, $dispatch }) => {
    const [api, image, username, bio, email, password] =
        $get('api', 'image', 'username', 'bio', 'email', 'password');
    
    const user = await api.User.save({
        image,
        username,
        bio,
        email,
        password,
    });
    
    // Update the user object upstream
    await $dispatch('setUser', user);
    
    if (!user) {
        const history = $get('history');
        
        history.push('/');
    }
};

export const logout = async ({ $get, $dispatch }) => {
    // Reset the user object upstream. This will clean up the JWT token as well.
    await $dispatch('setUser', null);
};

export const validate = ({ password, password2, ...values }) => {
    const errors = { ...values.errors };
    
    if (password !== '' && password.length < 3) {
        errors.password = 'Password should be longer than 3 characters';
    }
    else {
        delete errors.password;
    }
    
    if (password2 !== '' && password2 !== password) {
        errors.password2 = 'Passwords do not match!';
    }
    else {
        delete errors.password2;
    }
    
    return {
        ...values,
        errors,
    };
};
