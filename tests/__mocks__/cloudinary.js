// tests/__mocks__/cloudinary.js
export const uploader = {
  upload: jest.fn().mockResolvedValue({
    public_id: 'test-public-id',
    secure_url: 'https://test-url.com/image.jpg',
  }),
};

export default { uploader };