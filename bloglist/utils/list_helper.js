const dummy = (blogs) => {
    if(blogs) {
        return 1;
    }
}

const totalLikes = (blogs) => {
    const totalLikes = blogs.reduce((total, blog) => {
        return total + blog.likes;
    }, 0);
    return totalLikes;
}

const favoriteBlog = (blogs) => {
    if(blogs.length === 0) {
        return {};
    }
    
    const favoriteBlog = blogs.reduce((maxLikes, blog) => {
        if(blog.likes > maxLikes) {
            return blog.likes;
        } else {
            return maxLikes;
        }
    }, blogs[0].likes);
    return favoriteBlog;
}

module.exports = {dummy, totalLikes, favoriteBlog};