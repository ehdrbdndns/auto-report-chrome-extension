import { Button, Label, Modal, TextInput } from 'flowbite-react';
import { useState } from 'react';

export default function CreateCategoryModal() {
  const [openModal, setOpenModal] = useState(false);
  const [category, setCategory] = useState('');
  const [isCategoryValid, setCategoryValid] = useState(true);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleChangeCategory = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCategory(e.target.value);
    setCategoryValid(true);
  };

  const handleCreateCategory = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (!category) {
      setCategoryValid(false);
      return;
    }

    // Create category
  };

  return (
    <div>
      {/* Modal Button */}
      <div>
        {/* header */}
        <button
          className={`
            w-[100%] flex justify-between items-center opacity-[0.6] hover:opacity-[0.8] transition-opacity
            py-[0.8rem] px-[1.2rem] rounded-[0.8rem] cursor-pointer bg-black
          `}
          onClick={() => setOpenModal(true)}>
          <span className="text-sm font-bold white">{'분류할 카테고리 생성 (Click)'}</span>
        </button>
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
                helperText={isCategoryValid ? '' : '카테고리를 입력해주세요.'}
              />
            </div>
            <div className="w-full">
              <Button color="dark" onClick={handleCreateCategory}>
                카테고리 생성
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
