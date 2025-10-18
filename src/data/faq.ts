export interface FAQEntry {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FAQEntry[] = [
  {
    question: 'What is the Online Clipboard?',
    answer:
      'Online Clipboard is a temporary content-sharing tool that lets you move text, images, and files across devices or with other people. Each share is stored within our Cloudflare-managed infrastructure and is automatically deleted after 24 hours or after the first access.',
  },
  {
    question: 'How do I use the Online Clipboard?',
    answer:
      'It’s very simple: 1) Choose the type of content you want to share (text, image, or file); 2) Enter or upload your content; 3) Click "Create Share" to get a unique passcode or link; 4) Share the passcode or link with the recipient; 5) The recipient can retrieve the content by entering the passcode or clicking the link.',
  },
  {
    question: 'How secure is my content?',
    answer:
      'We rely on HTTPS for every transfer and store shares on Cloudflare D1 and R2 with access limited to our Worker. Every item is removed immediately after its first successful retrieval or within 24 hours, and we do not keep long-term backups.',
  },
  {
    question: 'How long is shared content kept?',
    answer:
      'Shared content is kept for up to 24 hours. If the share is accessed within 24 hours, the content is deleted immediately. This “burn after reading” mechanism ensures maximum privacy.',
  },
  {
    question: 'Do I need to register an account?',
    answer:
      'No. Our service is completely anonymous—no registration, login, or personal information required. Just visit the site and start using it right away.',
  },
  {
    question: 'How large can files be?',
    answer:
      'We currently support file uploads up to 300 MB. This should cover most everyday sharing needs, including documents, images, and small video files.',
  },
  {
    question: 'What’s the difference between a passcode and a share link?',
    answer:
      'A passcode is a 4- or 6-digit code that the recipient needs to enter manually. A share link is a full URL that the recipient can click to access the content directly. Both are equally secure—choose based on your use case.',
  },
  {
    question: 'What if I forget the passcode?',
    answer:
      'Unfortunately, we can’t help retrieve a forgotten passcode. Due to strict privacy protections, there’s no way for us to view or recover it. Consider using a share link, or be sure to save the passcode when creating a share.',
  },
  {
    question: 'Can I cancel a share after creating it?',
    answer:
      'Manual deletion of an existing share is not currently supported. However, all shares automatically expire after 24 hours or are deleted immediately after the first access. If you’re worried about leaks, avoid sharing sensitive information.',
  },
  {
    question: 'Which file formats are supported?',
    answer:
      'We support all common file formats, including documents (PDF, Word, Excel), images (JPG, PNG, GIF), and archives (ZIP, RAR). Any file up to 300 MB can be uploaded and shared.',
  },
  {
    question: 'Can a share be accessed multiple times?',
    answer:
      'No. For maximum security, each share can only be accessed once. After access, the content is immediately deleted. If multiple accesses are needed, ask the recipient to save the content upon first access.',
  },
  {
    question: 'Is this service completely free?',
    answer:
      'Yes. Online Clipboard is currently completely free with no hidden fees. Our goal is to provide a secure and convenient sharing tool for everyone.',
  },
];
