import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import { expect, test } from 'vitest'

describe('<Blog />', () => {
    let component

    const blog = {
        title: 'Test Blog Title',
        author: 'Test Author',
        url: 'http://testblog.com',
        likes: 5,
        user: {
            username: 'testuser',
            name: 'Test User',
            id: '1',
        },
        id: '12345'
    }

    const user = {
        username: 'testuser',
        name: 'Test User',
        token: 'sometoken'
    }

    const mockUpdateBlog = vi.fn()
    const mockRemoveBlog = vi.fn()

    beforeEach(() => {
        component = render(
            <Blog 
                blog={blog} 
                user={user} 
                updateBlog={mockUpdateBlog} 
                removeBlog={mockRemoveBlog} 
            />
        )
    })

    test('renders blog\'s title and author, but not url or likes by default',() => {
        expect(screen.getByText('Test Blog Title')).toBeDefined()
        expect(screen.getByText('Test Author')).toBeDefined()
        expect(screen.queryByText('http://testblog.com')).toBeNull()
        expect(screen.queryByText('likes 5')).toBeNull()
    })

    test('renders url and likes when the view button is clicked', async () => {
        const user = userEvent.setup()
        const button = screen.getByText('view')
        await user.click(button)
        expect(screen.getByText('http://testblog.com')).toBeDefined()
        expect(screen.getByText('likes 5')).toBeDefined()
    })

    test('if the like button is clicked twice, the event handler is called twice', async () => {
        const user = userEvent.setup()
        const viewButton = screen.getByText('view')
        await user.click(viewButton)
        const likeButton = screen.getByText('like')
        await user.click(likeButton)
        await user.click(likeButton)
        expect(mockUpdateBlog.mock.calls).toHaveLength(2)
    })
})