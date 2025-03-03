'use client'

import { forwardRef, useState, useImperativeHandle } from "react";

const SearchInput = forwardRef(({query = 'google'}: {query: string}, ref) => {

  const [searchData, setSearchData]  =useState({
    query: query,
    source: ''
  })

  useImperativeHandle(ref, () => ({
    getSearchData: () => ({
      query: searchData.query,
      source: searchData.source
    })
  }));

  return (
    <div className="flex flex-row justify-center items-center flex-1">    
      <input
        type="text"
        placeholder="输入公司名称或网站..."
        value={searchData.source}
        onChange={event => setSearchData({
          ...searchData,
          source: event.target.value
        })}
        className="flex-1 input input-lg bg-white input-accent mr-2"
      />
      <select 
        className="" 
        value={searchData.query}
        onChange={event => setSearchData({
          ...searchData,
          query: event.target.value
        })}
      >
        <option value="google">Google</option>
        <option value="linkedin">LinkedIn</option>
        <option value="website">官方网站</option>
      </select>
    </div>
  );
});

SearchInput.displayName = 'SearchInput';
export default SearchInput;
