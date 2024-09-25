import { categoryStorage } from '@extension/storage';
import { Button, Label, Modal, Spinner, TextInput } from 'flowbite-react';
import OpenAI from 'openai';
import { useCallback, useEffect, useState } from 'react';

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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
                text: `당신은 내용을 읽고 요약하는 요약 봇입니다.
                다음은 내가 설정한 카테고리별 링크 목록입니다. 
                각 링크를 클릭하여 내용을 파악한 후, 해당 카테고리별로 요약해 주세요. 
                요약한 내용은 각 카테고리별로 하나의 통합된 요약본으로 제공해 주세요. 
                이 요약은 사용자가 방문했던 링크들의 요약본을 보기 위함입니다.
                
                입력 형식
                카테고리1: 'example1.com', 'example2.com'
                카테고리2: 'example3.com', 'example4.com'
                
                반환 형식
                {
                  카테고리1: '요약 내용'  
                  카테고리2: '요약 내용'
                }`,
              },
            ],
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: '개발 지식: "https://portal.azure.com/#@kangnam.ac.kr/resource/subscriptions/2a978f32-9e00-4732-b1ba-9ccad4f2657e/budgets",\n    "https://www.youtube.com/watch?v=ZVDrH6rhzKg",\n    "https://learn.microsoft.com/en-us/answers/questions/1855030/getting-error-429-rate-limit-exceeded-error-when-t",\n    "https://leetcode.com/explore/learn/card/recursion-ii/470/divide-and-conquer/2872/",\n    "https://github.com/ehdrbdndns/auto-report-chrome-extension",\n    "https://github.com/ehdrbdndns/auto-report-chrome-extension/pulls",\n    "https://github.com/ehdrbdndns"\n인문학: "https://namu.wiki/w/%EC%86%8C%ED%81%AC%EB%9D%BC%EC%B9%98%EC%8A%A4"',
              },
            ],
          },
        ],
        temperature: 0.7,
        top_p: 0.95,
        max_tokens: 800,
      });

      const json: { [key: string]: string[] } = JSON.parse(completion.choices[0].message.content as string);

      console.log(json);

      // send email

      // delete all link order

      // delete tab data

      // delete link data
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
              ㄴ<span className="text-sm text-gray-600 block">{`분류된 링크들로 \n 보고서를 생성하시겠습니까?`}</span>
              <span className="text-sm text-gray-600 block">{`보고서는 메일로 전송됩니다.`}</span>
              <TextInput
                id="email"
                placeholder="분류할 카테고리를 입력해주세요."
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
