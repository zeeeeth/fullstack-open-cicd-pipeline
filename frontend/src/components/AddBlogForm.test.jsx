import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AddBlogForm from './AddBlogForm'
import { test } from 'vitest'

describe('<AddBlogForm />', () => {

    let component

    const blogObject = {
        title: 'New Blog Title',
        author: 'New Author',
        url: 'http://newblog.com'
    }

    const mockCreateBlog = vi.fn()
    const mockToggleVisibility = vi.fn()

    beforeEach(() => {
        component = render(
            <AddBlogForm 
                createBlog={mockCreateBlog}
                toggleVisibility={mockToggleVisibility}
            />
        )
    })

    test('calls the event handler it received as props with the right details when a new blog is created', async () => {
        const user = userEvent.setup()
        const titleInput = screen.getByLabelText('title:')
        const authorInput = screen.getByLabelText('author:')
        const urlInput = screen.getByLabelText('url:')
        const createButton = screen.getByText('create')

        await user.type(titleInput, blogObject.title)
        await user.type(authorInput, blogObject.author)
        await user.type(urlInput, blogObject.url)
        await user.click(createButton)

        expect(mockCreateBlog.mock.calls).toHaveLength(1)
        expect(mockCreateBlog.mock.calls[0][0]).toStrictEqual(blogObject)
    })
})