import { Button, Label, Modal, TextInput } from 'flowbite-react';
import { useState } from 'react';

export default function CreateCategoryModal({
  onCreateCategory,
}: {
  onCreateCategory: (category: string, error: (message: string) => void) => Promise<void>;
}) {
  const [openModal, setOpenModal] = useState(false);
  const [category, setCategory] = useState('');
  const [isCategoryValid, setCategoryValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleChangeCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategory(e.target.value);
    setCategoryValid(true);
  };

  const handleCreateCategory = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!category) {
      setErrorMessage('카테고리를 입력해주세요.');
      setCategoryValid(false);
      return;
    }

    // create category
    try {
      await onCreateCategory(category, message => setErrorMessage(message));
    } catch (error) {
      setCategoryValid(false);
      console.error(error);
      return;
    }

    handleCloseModal();
  };

  return (
    <div>
      {/* Modal Button */}
      <div>
        {/* header */}
        <Button className="w-[100%]" color="success" onClick={() => setOpenModal(true)}>
          분류할 카테고리 생성
        </Button>
      </div>
      {/* Modal Body */}
      <Modal show={openModal} size="lg" onClose={handleCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">카테고리 생성</h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="category" value="카테고리" color={isCategoryValid ? '' : 'failure'} />
              </div>
              <TextInput
                id="category"
                placeholder="분류할 카테고리를 입력해주세요."
                required
                value={category}
                onChange={handleChangeCategory}
                color={isCategoryValid ? '' : 'failure'}
                helperText={isCategoryValid ? '' : errorMessage}
              />
            </div>
            <div className="w-full">
              <Button className="w-[100%] opacity-90" color="success" onClick={handleCreateCategory}>
                카테고리 생성
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
