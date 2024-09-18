import { Button, Modal } from 'flowbite-react';
import { useState } from 'react';

export default function DeleteCategoryModal({ category }: { category: string }) {
  const [openModal, setOpenModal] = useState(false);

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleDeleteCategory = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      // todo delete category
    } catch (error) {
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
        <Button className="w-[100%] mt-[1rem] flex opacity-90" color="failure" onClick={() => setOpenModal(true)}>
          삭제
        </Button>
      </div>
      {/* Modal Body */}
      <Modal show={openModal} size="lg" onClose={handleCloseModal} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">{`"${category}"를 삭제하시겠습니까?`}</h3>
            <span className="text-sm text-gray-600">내부 링크도 같이 삭제됩니다.</span>
            <div className="w-full">
              <Button className="w-[100%] opacity-90" color="failure" onClick={handleDeleteCategory}>
                카테고리 삭제
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
