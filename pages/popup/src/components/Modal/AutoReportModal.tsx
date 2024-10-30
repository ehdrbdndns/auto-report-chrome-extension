import OpenAI from 'openai';
import { sendForm } from '@emailjs/browser';

import { useCallback, useEffect, useState } from 'react';
import { categoryStorage } from '@extension/storage';
import { Button, Label, Modal, Spinner, TextInput } from 'flowbite-react';

export default function AutoReportModal() {
  const [openModal, setOpenModal] = useState(false);
  const [email, setEmail] = useState('');
  const [isEmailValid, setEmailValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setError('');
  }, [openModal]);

  const validateEmail = useCallback((email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      );
  }, []);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailValid(true);
  };

  const handleReport = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    setIsLoading(true);

    if (!email) {
      setErrorMessage('이메일을 입력해주세요.');
      setEmailValid(false);
      setIsLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage('이메일 형식을 확인해주세요.');
      setEmailValid(false);
      setIsLoading(false);
      return;
    }

    const categoryList = categoryStorage.getSnapshot();

    if (!categoryList || Object.keys(categoryList).length < 2) {
      setError('분류된 링크가 없습니다.');
      setIsLoading(false);
      return;
    }

    let hasCategoryLink = false;
    Object.values(categoryList).forEach(category => {
      if (category.title !== 'default') {
        if (category.linkOrder.length > 0) {
          hasCategoryLink = true;
        }
      }
    });

    if (!hasCategoryLink) {
      setError('분류된 링크가 없습니다.');
      setIsLoading(false);
      return;
    }

    try {
      // OpenAI API for not students
      const pendingReportLinks = Object.entries(categoryList)
        .map(([category, { linkOrder }]) => {
          if (category === 'default') return '';

          return `'${category}': ${linkOrder.map(url => `'${url}'`).join(', ')}\n`;
        })
        .join('\n');

      console.log(pendingReportLinks);

      const openai = new OpenAI({
        apiKey: (import.meta as any).env.VITE_GPT_SECRET_KEY,
        dangerouslyAllowBrowser: true,
      });

      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: [
              {
                type: 'text',
                text: `
                당신은 각 카테고리의 URL을 이용해 해당 URL이 가리키는 페이지로 이동한 후 내용을 읽고 요약하는 요약 봇입니다.
                
                다음은 제가 설정한 카테고리별 URL 목록입니다. 
                각 URL를 클릭하여 웹 사이트 내용을 이해하고 정리하여 카테고리별로 요약해 주세요.

                요약한 내용은 각 카테고리별로 하나의 통합된 요약본으로 제공해 주세요. 

                입력 형식
                '카테고리1': 'example1.com', 'example2.com'
                '카테고리2': 'example3.com', 'example4.com'

                반환 형식
                {
                  "카테고리1": "요약 내용",
                  "카테고리2": "요약 내용"
                }`,
              },
            ],
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: pendingReportLinks,
              },
            ],
          },
        ],
      });

      console.log(completion.choices[0].message.content as string);
      const json: { [key: string]: string[] } = JSON.parse(completion.choices[0].message.content as string);
      // form 요소 생성
      const format = document.createElement('form');

      // email 필드 추가
      const emailInput = document.createElement('input');
      emailInput.type = 'hidden';
      emailInput.name = 'email';
      emailInput.value = email;
      format.appendChild(emailInput);

      // contents 필드 추가
      const contentsInput = document.createElement('input');
      contentsInput.type = 'hidden';
      contentsInput.name = 'contents';
      contentsInput.value = Object.entries(json).reduce((result, [category, summary]) => {
        return (result += `
        ${category}
        
        ${summary}

        `);
      }, '');
      format.appendChild(contentsInput);

      // category 필드 추가
      const categoryInput = document.createElement('input');
      categoryInput.type = 'hidden';
      categoryInput.name = 'category';
      categoryInput.value = Object.entries(categoryList).reduce((result, [category, { linkOrder }]) => {
        if (category === 'default') return result;
        return (result += linkOrder.map(url => `'${url}'`).join('\n'));
      }, '');
      format.appendChild(categoryInput);

      // sendForm 함수 호출
      await sendForm(
        (import.meta as any).env.VITE_EMAIL_SERVICE_KEY,
        (import.meta as any).env.VITE_EMAIL_TEMPLATE_KEY,
        format,
        (import.meta as any).env.VITE_EMAIL_API_KEY,
      );

      // TODO: delete all category
      // delete all link order

      // delete tab data

      // delete link data

      handleCloseModal();
    } catch (error) {
      console.error(error);
      setError('예기치 못한 문제가 발생했습니다.');
    }

    setIsLoading(false);
  };

  return (
    <div>
      {/* Modal Button */}
      <div>
        {/* header */}
        <Button className="w-[100%]" onClick={() => setOpenModal(true)}>
          보고서 생성
        </Button>
      </div>
      {/* Modal Body */}
      <Modal show={openModal} size="lg" onClose={handleCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">보고서 생성</h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email" value="이메일" color={isEmailValid ? '' : 'failure'} />
              </div>
              <TextInput
                id="email"
                placeholder="보고서를 받을 이메일을 입력해주세요."
                required
                value={email}
                onChange={handleChangeEmail}
                color={isEmailValid ? '' : 'failure'}
                helperText={isEmailValid ? '' : errorMessage}
              />
              <span className="text-sm text-gray-600 block">{`${isLoading ? '다소 시간이 걸릴 수 있습니다.' : ''}`}</span>
            </div>
            <span className="text-sm red block">{`${error}`}</span>
            <div className="w-full">
              <Button className="w-[100%] opacity-90" color="success" onClick={handleReport}>
                {isLoading ? <Spinner aria-label="Default status example" /> : '생성하기'}
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
