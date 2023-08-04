const mongoose = require('mongoose');
const supertest = require('supertest');
const helper = require('./test_helper');
const app = require('../app');
const Blog = require('../models/blog');

const api = supertest(app);

beforeEach(async () => {
    await Blog.deleteMany({})
    const noteObjects = helper.initialBlogs.map(blog => new Blog(blog))
    const promiseArray = noteObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

describe('Get blog info', () => {
    test('blogs returned as json', async () => {
        await api.get('/api/blogs').expect(200).expect('Content-Type', /application\/json/);
    });
    
    test('The unique identifier property of the blog posts is by default _id', async () => {
        const blogs = await Blog.find({});
        expect(blogs[0]._id).toBeDefined();
    });
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Adding a new blog', () => {
    test('Adding valid blog', async () => {
        const newBlog = {
            title:"Canonical string reduction",
            author:"Edsger W. Dijkstra",
            url:"http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
            likes:12
        }
        await api.post('/api/blogs').send(newBlog).expect(200).expect('Content-Type', /application\/json/);

        const blogsOfDb = await helper.blogsInDb();
        expect(blogsOfDb).toHaveLength(helper.initialBlogs.length+1);

        const content = blogsOfDb.map(blog => blog.title);
        expect(content).toContain(
        'Canonical string reduction'
        )
    })
})

describe('Updating an existing blog', () => {
    test('Update valid blog', async () => {
        const newBlog = {
            title:"Masterpiece",
            author:"Edsger W. Dijkstra",
            url:"http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
            likes:12
        }

        await api.post('/api/blogs').send(newBlog).expect(200);

        const allBlogs = await helper.blogsInDb()
        const blogToUpdate = allBlogs.find(blog => blog.title === newBlog.title)

        const updatedBlog = {
            ...blogToUpdate,
            likes: blogToUpdate.likes + 1
        }

        await api.put(`/api/blogs/${blogToUpdate}`).send(updatedBlog).expect(200).expect('Content-Type', /application\/json/);
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)
        const foundBlog = blogsAtEnd.find(blog => blog.likes === 13)
        expect(foundBlog.likes).toBe(13)
    })
})

describe('Deleting existing blogs', () => {
    test('Delete a blog', async () => {
        const newBlog = {
            title:"The best blog ever",
            author:"Me",
            url:"http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
            likes:12
          }
      
          await api.post('/api/blogs').send(newBlog).expect(200).expect('Content-Type', /application\/json/);

        const allBlogs = await helper.blogsInDb();
        const blogToDelete = allBlogs.find(blog => blog.title === newBlog.title);

        await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204).expect('Content-Type', /application\/json/);
        const blogsAtEnd = await helper.blogsInDb()

        expect(blogsAtEnd).toHaveLength(
        helper.initialBlogs.length
        )

        const contents = blogsAtEnd.map(r => r.title)

        expect(contents).not.toContain(blogToDelete.title)
    })
})

