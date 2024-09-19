import { categoryStorage } from '@extension/storage';
import { Button, Modal, Spinner } from 'flowbite-react';
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

    const categoryList = categoryStorage.getSnapshot();

    if (!categoryList || Object.keys(categoryList).length < 2) {
      setError('카테고리를 생성해야합니다.');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      // todo categorize links
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
