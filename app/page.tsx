'use client'
import SearchInput from '@/components/SearchInput';
import { useRef, useState } from 'react';

export default function HomePage() {
  const [searchComponents, setSearchComponents] = useState([1, 2, 3]);
  const queryType = ['google', 'linkedin', 'website'];
  const searchInputRefs = useRef([]);
  
  const addSearchComponent = () => {
    setSearchComponents([...searchComponents, searchComponents.length + 1]);
  };

  const removeSearchComponent = (index: number) => {
    if (searchComponents.length > 1) {
      setSearchComponents(prev => prev.filter((_, i) => i !== index));
      searchInputRefs.current = searchInputRefs.current.filter((_, i) => i !== index);
    }
  };

  const handleSearch = () => {
    const searchData = searchInputRefs.current
      .filter(ref => ref !== null)
      .map(ref => ref.getSearchData());
    console.log('Search Data:', searchData);
    // 这里可以添加处理搜索数据的逻辑
  };

  return (
    <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
      <div className="space-y-4 w-1/2 flex flex-col items-center justify-center">
        {searchComponents.map((_, index) => (
          <div key={index} className='w-full flex justify-center items-center'>
            <button className="btn btn-active btn-error mx-2" onClick={() => removeSearchComponent(index)}>X</button>
            <SearchInput 
              ref={el => searchInputRefs.current[index] = el}
              query={queryType[index%queryType.length]}
            />
          </div>
        ))}
      </div>
      
      <div className="flex gap-4 mt-6">
        <button 
          className="btn btn-primary"
          onClick={addSearchComponent}
        >
          添加搜索框
        </button>
        <button
          className="btn btn-secondary"
          onClick={handleSearch}
        >
          开始搜索
        </button>
      </div>
    </div>
  );
}