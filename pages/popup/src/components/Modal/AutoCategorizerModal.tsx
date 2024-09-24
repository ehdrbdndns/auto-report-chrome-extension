import { categoryStorage, linkStorage } from '@extension/storage';
import { Button, Modal, Spinner } from 'flowbite-react';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import OpenAI, { AzureOpenAI } from 'openai';
import { useEffect, useState } from 'react';

export default function AutoCategorizerModal() {
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setError('');
  }, [openModal]);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleCategorizer = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setIsLoading(true);

    const categoryList = categoryStorage.getSnapshot();
    const linkList = linkStorage.getSnapshot();

    if (!categoryList || Object.keys(categoryList).length < 2) {
      setError('카테고리를 생성해야합니다.');
      setIsLoading(false);
      return;
    }

    if (!linkList) {
      setError('추적한 링크가 없습니다.');
      setIsLoading(false);
      return;
    }

    try {
      // OpenAI API for not students
      const openai = new OpenAI({
        apiKey: (import.meta as any).env.VITE_GPT_SECRET_KEY,
        dangerouslyAllowBrowser: true,
      });

      // Azure OpenAI API for students
      // const openai = new AzureOpenAI({
      //   endpoint: "https://autoreport4168000622.openai.azure.com",
      //   apiKey: (import.meta as any).env.VITE_AZUR_SECRET_KEY,
      //   dangerouslyAllowBrowser: true,
      //   apiVersion: "2023-03-15-preview"
      // })

      const defaultLinkList = categoryList['default'].linkOrder.filter(link => linkList[link].duration > 1000 * 60 * 3);
      const categoryKeyList = Object.keys(categoryList).filter(category => category !== 'default');

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: [
              {
                type: 'text',
                text: `
                당신은 웹페이지 분류기를 만들고 있습니다.

                제공되는 웹페이지를 클릭하여 내용을 읽고 파악하여, 카테고리로 분류하세요. 

                카테고리는 제가 제공한 목록 중에서 선택하며, 내용을 읽을 수 없거나 분류할 수 없는 경우에는 "default"라는 카테고리로 분류하세요. 

                웹페이지를 분류한 결과는 다음과 같은 반환 형식으로 반환하세요. 
                
                반환 형식 - 예시 { 뉴스: ["https://example-news.com"], "기술": ["https://example-tech.com"] } 
                
                사용자가 제공하는 카테고리는 ','로 구분되어 입력됩니다. 
                
                사용자가 제공하는 카테고리 예시 카테고리: 뉴스,기술
                
                사용자가 제공하는 웹페이지의 링크는 ','로 구분되어 입력됩니다.
                
                사용자가 제공하는 웹페이지 링크 예시 
                
                웹페이지: 'https://naver.com','https://google.com'`,
              },
            ],
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `카테고리: ${categoryKeyList.join(',')}`,
              },
              {
                type: 'text',
                text: `웹페이지: ${defaultLinkList.join(',')}`,
              },
            ],
          },
        ],
        temperature: 0.7,
        top_p: 0.95,
        max_tokens: 800,
      });

      console.log(JSON.parse(completion.choices[0].message.content as string));
    } catch (error) {
      console.error(error);
      setError('예기치 못한 문제가 발생했습니다.');
    }

    setIsLoading(false);
    handleCloseModal();
  };

  return (
    <div>
      {/* Modal Button */}
      <div>
        {/* header */}
        <button
          className="bg-primary-color py-[0.3rem] px-[1.2rem] rounded-[0.6rem] hover:opacity-70"
          onClick={() => setOpenModal(true)}>
          <span className="text-sm font-semibold white">자동 분류</span>
        </button>
      </div>
      {/* Modal Body */}
      <Modal show={openModal} size="lg" onClose={handleCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">{`자동 분류`}</h3>
            <span className="text-sm text-gray-600 block">{`추적한 링크들을 \n 생성하신 카테고리에 자동으로 분류하시겠습니까?`}</span>
            <span className="text-sm text-gray-600 block">{`${isLoading ? '다소 시간이 걸릴 수 있습니다.' : ''}`}</span>
            <span className="text-sm red block">{`${error}`}</span>
            <div className="w-full">
              <Button className="w-[100%] opacity-90" color="success" onClick={handleCategorizer}>
                {isLoading ? <Spinner aria-label="Default status example" /> : '분류하기'}
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
