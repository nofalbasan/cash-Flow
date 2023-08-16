import React, { useEffect, useState } from 'react'
import styles from '@/styles/form.module.css'
import { fetchMemberAsync } from '@/store/slices/MemberSlice';
import { useSelector, useDispatch } from 'react-redux';
import { fetchCategoryAsync } from '@/store/slices/CategorySlice';
import { addBorrowAsync } from '@/store/slices/BorrowSlice';


const AddBorrow = () => {


    // Globel State Manegment
    const dispatch = useDispatch();
    const member = useSelector((state) => state.member.member);



    // state 
    const [validationError, setValidationError] = useState('');
    const [isFormValid, setIsFormValid] = useState(false); // Track form validity

    const [PaymentData, setPaymentData] = useState({
        amount: '',
        collectedby: '',
        mid: '',
        bailmid: ''
    });


    // handle change input value
    const handleChange = (e) => {
        const { name, value } = e.target;
        setPaymentData({ ...PaymentData, [name]: value })
    }


    // Form Validataion 
    useEffect(() => {
        // Check if all fields except altMobileNo are filled
        const allFieldsFilled = Object.values(PaymentData).every((value) => value !== '');
        setIsFormValid(allFieldsFilled);
    }, [PaymentData]);

    // Save DAta 
    const handleSubmit = (e) => {
        e.preventDefault();
        let username = localStorage.getItem("user");
        // Validate all fields

        if (isNaN(PaymentData.amount)) {
            setValidationError(`Amount Accept Only Digit Number`);
            return;
        }

        if (PaymentData.mid == PaymentData.bailmid) {
            setValidationError(`Member Can Not Be Own Bail`);
            return;
        }

        // Process form data here
        setValidationError('');
        

        try {
            dispatch(addBorrowAsync({ ...PaymentData, username }));
        } catch (error) {
            console.log("Error is Conming" + error);
        }
    }


    // Auto Complete Field For Member

    const sortedNames = [...member].sort((a, b) => a.name.localeCompare(b.name))
    const [inputValue, setInputValue] = useState('');
    const [suggestedNames, setSuggestedNames] = useState([]);

    const handleChangeAutoComplete = (event) => {
        const value = event.target.value;
        setInputValue(value);
        console.log(sortedNames);
        const suggestions = sortedNames.filter(m =>
            m.name.toLowerCase().includes(value.toLowerCase()) && value !== ""
        );
        console.log(suggestions);
        setSuggestedNames(suggestions);
        setPaymentData(prevData => ({ ...prevData, mid: '' }));  // Clear mid when typing after selecting a name
        console.log(PaymentData);

    };

    const handleNameClick = (name, value) => {
        setInputValue(name);
        setPaymentData(prevData => ({ ...prevData, mid: value }));
        setSuggestedNames([]);
        console.log(PaymentData);
    };



    // Auto Complete Field For Bail 

    const [bailInputValue, setBailInputValue] = useState('');
    const [suggestedBailNames, setSuggestedBailNames] = useState([]);

    const handleChangeBailAutoComplete = (event) => {
        const value = event.target.value;
        setBailInputValue(value);

        const bailSuggestions = sortedNames.filter(m =>
            m.name.toLowerCase().includes(value.toLowerCase()) && value !== ""
        );
        setSuggestedBailNames(bailSuggestions);
        setPaymentData(prevData => ({ ...prevData, bailmid: '' }));
    };

    const handleBailNameClick = (name, value) => {
        setBailInputValue(name);
        setPaymentData(prevData => ({ ...prevData, bailmid: value }));
        setSuggestedBailNames([]);
    };


    useEffect(() => {
        dispatch(fetchMemberAsync())
        dispatch(fetchCategoryAsync())
    }, [])



    return (
        <>
            {/* Add Data */}
            <div className="bottom-data">
                <div className="orders">
                    <div className="header">
                        <i className='bx bx-receipt'></i>
                        <h3>Add New Payment</h3>
                    </div>
                    <section className={styles.container}>
                        {/* <header>Registration Form</header> */}
                        <form action="#" className={styles.form}>
                            <div className={styles.input_box}>
                                <label htmlFor='fullName'>Select Member</label>
                                <input
                                    type="text"
                                    placeholder="Enter full name"
                                    name='fullName'
                                    id='fullName'
                                    value={inputValue}
                                    onChange={handleChangeAutoComplete}
                                    autoComplete='off'
                                    required
                                />
                                <ul className="autocompletelist">
                                    {suggestedNames.slice(0, 5).map((e, index) => (
                                        <li
                                            key={index}
                                            className="autocomplete-list-items" // Use the appropriate CSS module class name here
                                            style={{ cursor: "pointer" }}
                                            onClick={() => handleNameClick(e.name, e.id)}
                                        >
                                            <b>{e.name}</b>
                                        </li>
                                    ))}
                                </ul>
                            </div>


                            <div className={styles.column}>
                                <div className={styles.input_box}>
                                    <label htmlFor='amount'>Amount</label>
                                    <input type="text" placeholder="Enter Amount" name='amount' id='amount' value={PaymentData.amount} onChange={handleChange} required />
                                </div>
                                <div className={styles.input_box}>
                                    <label htmlFor='collectedby'>Collected By</label>
                                    <input type="text" placeholder="Enter collectedby address" name='collectedby' id='collectedby' value={PaymentData.collectedby} onChange={handleChange} required />
                                </div>
                            </div>
                            <div className={styles.input_box}>
                                <label htmlFor='bailname'>Select Bail Member</label>
                                <input
                                    type="text"
                                    placeholder="Enter full name"
                                    name='bailname'
                                    id='bailname'
                                    value={bailInputValue}
                                    onChange={handleChangeBailAutoComplete}
                                    autoComplete='off'
                                    required
                                />
                                <ul className="autocompletelist">
                                    {suggestedBailNames.slice(0, 5).map((e, index) => (
                                        <li
                                            key={index}
                                            className="autocomplete-list-items"
                                            style={{ cursor: "pointer" }}
                                            onClick={() => handleBailNameClick(e.name, e.id)}
                                        >
                                            <b>{e.name}</b>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {validationError && <p className='text-red-600 mt-5' >* {validationError}</p>}

                            <button className={`${isFormValid ? '' : 'disable-btn'}`} disabled={!isFormValid} onClick={handleSubmit}>Submit</button>
                        </form>
                    </section>
                </div>
            </div>
            {/* End Add Data */}
        </>
    )
}

export default AddBorrow
