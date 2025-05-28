import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import PostList from '../components/PostList'
import * as api from '../api'

// Мокаем API
jest.mock('../api')

const mockPosts = [
  { id: 1, title: 'Первый пост', content: 'Контент первого поста', userId: 1 },
  { id: 2, title: 'Второй пост', content: 'Контент второго поста', userId: 2 }
]

const mockUsers = {
  1: { id: 1, name: 'Иван Иванов', avatarUrl: '/avatars/ivan.png' },
  2: { id: 2, name: 'Мария Смирнова', avatarUrl: '/avatars/maria.png' }
}

describe('PostList', () => {
  beforeEach(() => {
    api.fetchPosts.mockResolvedValue(mockPosts)
    api.fetchUserById.mockImplementation((id) => Promise.resolve(mockUsers[id]))
  })

  it('отображает список постов', async () => {
    render(<PostList />)

    expect(await screen.findByText('Первый пост')).toBeInTheDocument()
    expect(screen.getByText('Контент первого поста')).toBeInTheDocument()

    expect(screen.getByText('Второй пост')).toBeInTheDocument()
    expect(screen.getByText('Контент второго поста')).toBeInTheDocument()
  })

  it('отображает имя и аватар пользователя для каждого поста', async () => {
    render(<PostList />)

    await waitFor(() => {
      expect(screen.getByText('Иван Иванов')).toBeInTheDocument()
      expect(screen.getByAltText('Avatar Иван Иванов')).toHaveAttribute('src', '/avatars/ivan.png')

      expect(screen.getByText('Мария Смирнова')).toBeInTheDocument()
      expect(screen.getByAltText('Avatar Мария Смирнова')).toHaveAttribute('src', '/avatars/maria.png')
    })
  })
})
