import React, { useState, useEffect, useRef } from 'react'
import './Chatview.css'
import axios from 'axios'
import { FaRegTrashCan } from 'react-icons/fa6'

const Chatview = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState('type') // 'type', 'sub-option', 'form', 'success'
  const [propertyType, setPropertyType] = useState(null) // 'Residential' or 'Commercial'
  const [surveys, setSurveys] = useState([])
  const [allSurveys, setAllSurveys] = useState([])
  const [dynamicPropertyTypes, setDynamicPropertyTypes] = useState([])
  const [staticQuestions, setStaticQuestions] = useState([])
  const [selectedSurvey, setSelectedSurvey] = useState(null)
  const [dynamicQuestions, setDynamicQuestions] = useState([])
  const [loading, setLoading] = useState(false)
  const [findLoading, setFindLoading] = useState(false)
  const [error, setError] = useState(null)
  const [showOptions, setShowOptions] = useState(true)

  const [isManualAddress, setIsManualAddress] = useState(false)
  const [addressList, setAddressList] = useState([])
  const [selectedAddressKey, setSelectedAddressKey] = useState('')
  const [postcodeID, setPostcodeID] = useState(0)
  const [isValidPostcode, setIsValidPostcode] = useState(false)

  const [inputValue, setInputValue] = useState('')
  const [formData, setFormData] = useState({
    postcode: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    county: '',
    tenure: '',
    additionalInfo: '',
    estimatedValue: '',
    bedrooms: '',
    buildingType: '',
    // Customer Details
    title: 'Mr',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    altPhoneNumber: '',
    email: '',
  })
  const [history, setHistory] = useState([])
  const messagesEndRef = useRef(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history, loading])

  // Debounced postcode validation
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.postcode && formData.postcode.trim().length >= 5) {
        validatePostcode(formData.postcode)
      } else {
        setIsValidPostcode(false)
      }
    }, 1000)
    return () => clearTimeout(timer)
  }, [formData.postcode])

  // Initial data fetch 
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true)
      try {
        // Fetch all surveys to extract unique types
        const surveyRes = await fetch('https://stagingapi.surveybooker.co.uk/api/surveyorSurveyType/stagingsandbox.surveybooker.co.uk', {
          headers: { 'Accept': 'application/json' }
        })
        const surveyJson = await surveyRes.json()
        if (surveyJson.status === 'success') {
          setAllSurveys(surveyJson.data)
          const types = [...new Set(surveyJson.data.map(s => s.staticSurveyType?.type))].filter(Boolean)
          setDynamicPropertyTypes(types.map(t => ({
            id: t,
            label: t,
            desc: t === 'Residential' ? 'Houses, apartments & personal properties' : 'Commercial or business properties',
            icon: t === 'Residential' ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
            )
          })))
        }

        // Fetch static questions
        const staticRes = await fetch('https://stagingapi.surveybooker.co.uk/api/dynamicQuestion/getStaticQuestion?host=stagingsandbox.surveybooker.co.uk', {
          headers: { 'Accept': 'application/json' }
        })
        const staticJson = await staticRes.json()
        if (staticJson.status === 'success') {
          setStaticQuestions(staticJson.data.rows)
        }
      } catch (err) {
        console.error('Initial fetch failed', err)
      } finally {
        setLoading(false)
      }
    }
    fetchInitialData()
  }, [])

  const buildingOptions = [
    'Barn', 'Bungalow', 'Converted', 'Cottage', 'Detached', 'End-Terraced',
    'Flat', 'High Rise', 'High Rise over 10 stories', 'Maisonette',
    'Mid-Terraced', 'Purpose Built', 'Semi-Detached', 'Terraced',
    'Town House', 'Unknown'
  ]

  const tenureOptions = ['Freehold', 'Leasehold', 'Unknown']
  const binaryOptions = [{ answerText: 'Yes' }, { answerText: 'No' }]

  const validatePostcode = async (postcode) => {
    if (!postcode) return false
    try {
      // stagingapi
      const response = await fetch(`https://stagingapi.surveybooker.co.uk/api/postcode/checkPostCode/${encodeURIComponent(postcode)}/stagingsandbox.surveybooker.co.uk/${propertyType}/${selectedSurvey?.surveyorSurveyTypeID || 1121}`, {
        headers: {
          'Accept': 'application/json'
        }
      })
      if (!response.ok) return false
      const json = await response.json()
      const valid = json.status === 'success' || json.code === 200
      setIsValidPostcode(valid)
      // Capture postCodeID from validation response
      if (valid && json.data?.postCodeID) {
        setPostcodeID(json.data.postCodeID)
      }
      return valid
    } catch (err) {
      console.error('Postcode validation failed', err)
      return false
    }
  }

  const handleFindAddress = async () => {
    if (!formData.postcode) return
    setFindLoading(true)

    const isValid = await validatePostcode(formData.postcode)

    try {
      const response = await fetch(`/proxy/api/company/getAddressKey?postcode=${encodeURIComponent(formData.postcode)}&for=postcode&host=stagingsandbox.surveybooker.co.uk`, {
        headers: {
          'Accept': 'application/json'
        }
      })

      if (!response.ok) throw new Error(`API returned ${response.status}`)

      const json = await response.json()
      const data = json.data || (Array.isArray(json) ? json : [])

      if (data.length > 0) {
        setAddressList(data)
        setIsValidPostcode(true)
        // postCodeID is already correctly set by validatePostcode() above (line 166)
        // Do NOT overwrite with udprn — udprn is a Royal Mail ID, NOT the backend postCodeID
      } else {
        setAddressList([])
        if (!isValid) alert('No addresses found. You can enter the address manually.')
      }
    } catch (err) {
      console.error('Address lookup failed', err)
      setAddressList([])
      if (!isValid) setIsManualAddress(true)
    } finally {
      setFindLoading(false)
    }
  }

  const handleAddressSelect = (key) => {
    setSelectedAddressKey(key)
    if (!addressList || !Array.isArray(addressList)) return

    const addr = addressList.find(a => (a.udprn?.toString() === key || a.envelopeAddress?.summaryLine === key))
    if (addr && addr.envelopeAddress) {
      // postCodeID already set from validatePostcode API — do NOT overwrite with udprn
      setFormData(prev => ({
        ...prev,
        addressLine1: addr.envelopeAddress.addressLine1?.trim() || addr.organisationName || ' ',
        addressLine2: addr.envelopeAddress.addressLine2 || '',
        city: addr.envelopeAddress.town || '',
        county: addr.envelopeAddress.county || '',
        postcode: addr.envelopeAddress.postCode || prev.postcode
      }))
    }
  }

  const fetchQuestions = async (surveyID) => {
    setLoading(true)
    try {
      // 1. Filter static questions
      const filteredStatic = staticQuestions.filter(q =>
        q.type?.split(',').includes(surveyID.toString()) && !q.hideQuestion
      ).map(q => ({
        ...q,
        isStatic: true,
        // Map questionType to answerType for rendering
        answerType: q.questionType === 'property value' ? 'number' :
          q.questionType === 'property type' ? 'dropdown' :
            q.questionType === 'bedrooms' ? 'number' :
              q.questionType === 'tenure' ? 'dropdown' :
                q.questionType === 'listed building' ? 'radio' :
                  q.questionType === 'additional information' ? 'textarea' :
                    q.questionType === 'property size' ? 'number' : 'textbox',
        answers: q.questionType === 'property type' ? buildingOptions.map(b => ({ answerText: b })) :
          q.questionType === 'tenure' ? tenureOptions.map(t => ({ answerText: t })) :
            q.questionType === 'listed building' ? binaryOptions :
              (q.answers || [])
      }))

      // 2. Fetch dynamic questions
      const response = await fetch('https://sandboxapi.surveybooker.co.uk/api/dynamicQuestion/getQuestion?orderQuestion=ASC&host=sandbox.surveybooker.co.uk', {
        headers: { 'Accept': 'application/json' }
      })
      const json = await response.json()

      let filteredDynamic = []
      if (json.status === 'success') {
        filteredDynamic = json.data.rows.filter(q => q.type?.split(',').includes(surveyID.toString()))
      }

      const allQuestions = [...filteredStatic, ...filteredDynamic]
      setDynamicQuestions(allQuestions)

      const dynamicFields = {}
      allQuestions.forEach(q => {
        const fieldName = `q_${q.questionID}`
        dynamicFields[fieldName] = q.answerType?.toLowerCase() === 'checkbox' ? [] : ''
      })
      setFormData(prev => ({ ...prev, ...dynamicFields }))
    } catch (err) {
      console.error('Fetch questions failed', err)
    } finally {
      setLoading(false)
    }
  }

  const handleTypeSelect = (type) => {
    setPropertyType(type)
    setHistory(prev => [...prev, { sender: 'user', text: `🏠 ${type}` }])
    const filtered = allSurveys.filter(s => s.staticSurveyType?.type?.trim() === type.trim())
    setSurveys(filtered)
    setCurrentStep('sub-option')
  }

  const handleSurveySelect = (survey) => {
    setSelectedSurvey(survey)
    setHistory([...history, { sender: 'user', text: `📋 ${survey.staticSurveyType.staticSurveyTypeName}` }])
    fetchQuestions(survey.surveyorSurveyTypeID)
    setCurrentStep('form')
  }

  const getDynamicVal = (id) => formData[`q_${id}`] || ""

  const handleFormSubmit = (e) => {
    e.preventDefault()

    // Create a structured summary of the property details
    const propertySummary = (
      <div className="form-history-summary">
        <div className="summary-header">Property Details Submitted</div>
        <div className="summary-row"><span>Address:</span> {formData.addressLine1 || formData.postcode}</div>
        {formData.city && <div className="summary-row"><span>City:</span> {formData.city}</div>}
        <div className="summary-row"><span>Value:</span> £{getDynamicVal(305) || '0'}</div>
        <div className="summary-row"><span>Bedrooms:</span> {getDynamicVal(306) || '0'}</div>
      </div>
    )

    setHistory(prev => [...prev, { sender: 'user', text: propertySummary }])
    setCurrentStep('customer-details')
  }

  const handleGetQuote = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const host = 'stagingsandbox.surveybooker.co.uk'

    try {
      // 1. Account Lookup
      const lookupRes = await fetch('https://stagingapi.surveybooker.co.uk/api/auth/accountlookup?for=quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email: formData.email, host })
      })
      await lookupRes.json()

      // 2. User Register
      const cleanNumber = (num) => (num || '').replace(/\D/g, '')
      const fName = (formData.firstName || '').trim()
      const lName = (formData.lastName || '').trim()
      const regSalutation = formData.title || null
      // Successful API sends name WITH salutation prefix: "Mr Hello World"
      const fullName = regSalutation ? `${regSalutation} ${fName} ${lName}`.trim() : `${fName} ${lName}`.trim()

      const registerRes = await fetch('https://stagingapi.surveybooker.co.uk/api/auth/userRegister', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          firstName: fName,
          lastName: lName,
          salutation: regSalutation,
          name: fullName,
          number: cleanNumber(formData.phoneNumber),
          alterNativeNumber: cleanNumber(formData.altPhoneNumber) || cleanNumber(formData.phoneNumber),
          email: formData.email,
          company: { host },
          agreeToTerms: 0,
          marketingEmails: 0,
          signUpDate: new Date().toISOString().split('.')[0] + 'Z'
        })
      })
      const registerJson = await registerRes.json()
      if (registerJson.status !== 'success') throw new Error('Registration failed')

      const { userID, newUser, duplicateFieldType, duplicateOfSurveyID } = registerJson.data

      // 3. Prepare Manage Quote Payload
      // Build address string using 'UK' as the country component, matching successful API format
      const address = [formData.addressLine1, formData.addressLine2, formData.city, 'UK', formData.postcode].filter(Boolean).join(', ')

      // Filter out static property questions (304-311) from the dynamic array
      // Only send exact fields the backend expects — do NOT spread the full API question object
      const dynamicQuestionAnswers = dynamicQuestions
        .filter(q => q.questionID < 304 || q.questionID > 311)
        .map(q => {
          const val = formData[`q_${q.questionID}`]
          const finalVal = Array.isArray(val) ? val.join(', ') : (val !== undefined && val !== '' ? val : null)
          return {
            value: typeof finalVal === 'string' ? finalVal.trim() : finalVal,
            questionID: q.questionID,
            questionText: q.questionText,
            questionType: q.questionType,
            answerType: q.answerType,
            answerList: q.answerList || (q.answers?.map(a => a.answerText).join(',') || ''),
            companyID: q.companyID
          }
        })

      const rawBaseQuote = getDynamicVal(304) || "0"
      const formattedBaseQuote = isNaN(rawBaseQuote) ? rawBaseQuote : Number(rawBaseQuote).toLocaleString('en-GB')

      const manageQuotePayload = {
        address,
        city: (formData.city || '').trim().toUpperCase(),
        country: 'UK', // Always UK — formData.county is a county name, not country
        postCode: (formData.postcode || '').trim().toUpperCase(),
        line_1: (formData.addressLine1 || '').trim(),
        line_2: (formData.addressLine2 || '').trim(),
        firstName: fName,
        lastName: lName,
        name: fullName,  // now "Mr Hello World"
        email: formData.email,
        number: cleanNumber(formData.phoneNumber),
        salutation: regSalutation,
        userID,
        newUser: newUser || false,
        duplicateFieldType: duplicateFieldType || null,
        duplicateOfSurveyID: duplicateOfSurveyID || null,
        duplicateCustomerFlag: !!duplicateOfSurveyID,
        host,
        staticSurveyTypeID: selectedSurvey?.staticSurveyTypeID,
        // surveyorSurveyTypeID intentionally removed — not present in successful call
        surveyorID: '',
        tenure: (getDynamicVal(307) || 'Freehold').trim(),
        bedrooms: getDynamicVal(306).toString() || '0',
        baseQuote: formattedBaseQuote,
        finalPrice: '0',
        dynamicQuestionAnswers,
        listedBuilding: getDynamicVal(308) === 'Yes' ? 1 : 0,
        additionalInformation: (getDynamicVal(309) || 'No').trim(),
        postCodeID: Number(postcodeID) || 0,
        propertyType: (getDynamicVal(305) || '').trim(),
        lat: '',
        lng: '',
        panelQuote: false,
        isReportName: false,
        isIntroducerReportName: false,
        reportNameSalutation: regSalutation || '',  // matches successful call: "Mr"
        agentReportFirstName: fName,
        agentReportLastName: lName,
        agentID: null,
        assignedCustomCompanies: null,
        introducerContactID: null,
        refferedBy: null
      }
      console.log('Final Manage Quote Payload:', manageQuotePayload)

      const quoteRes = await fetch('https://stagingapi.surveybooker.co.uk/api/manageQuote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(manageQuotePayload)
      })
      const quoteJson = await quoteRes.json()
      if (quoteJson.status !== 'success') throw new Error('Quote management failed')

      const quoteData = quoteJson.data

      // 4. Get Summary
      try {
        await fetch(`/proxy/api/summaryPoints/getSummary?staticSurveyTypeID=${selectedSurvey?.staticSurveyTypeID}`)
      } catch (e) {
        console.warn('Summary fetch failed', e)
      }

      const successMsg = (
        <div className="quote-success-summary">
          <p>✅ <strong>Quote Requested Successfully!</strong></p>
          <div className="quote-details">
            <p><strong>Survey ID:</strong> {quoteData.surveyID}</p>
            <p><strong>Property:</strong> {quoteData.property?.address}</p>
            <p><strong>Type:</strong> {selectedSurvey?.staticSurveyType?.staticSurveyTypeName}</p>
          </div>
        </div>
      )

      const userSummary = (
        <div className="form-history-summary">
          <div className="summary-header">Customer Details Submitted</div>
          <div className="summary-row"><span>Name:</span> {formData.title} {formData.firstName} {formData.lastName}</div>
          <div className="summary-row"><span>Email:</span> {formData.email}</div>
          <div className="summary-row"><span>Phone:</span> {formData.phoneNumber}</div>
        </div>
      )

      setHistory(prev => [...prev, { sender: 'user', text: userSummary }, { sender: 'bot', text: successMsg }])
      setCurrentStep('success')
    } catch (err) {
      console.error('Final quote flow failed', err)
      setError(err.message || 'Something went wrong while processing your quote. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Reset validation state when postcode changes to ensure fields hide if invalid
    if (field === 'postcode' && isValidPostcode) {
      setIsValidPostcode(false)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    const userText = inputValue
    // 1. Show user message immediately
    setHistory(prev => [...prev, { sender: 'user', text: userText }])
    setInputValue('')

    // 2. Show loading dots while waiting for API
    setLoading(true)

    const data = {
      user_id: "jkbhbnknj",
      message: userText,
      collection_name: "default",
      cal_api_key: "cal_live_22f1f52f330fd02003192c7811148445",
      event_type_id: "3416412"
    }

    let json = {}
    try {
      const res = await axios.post('https://dove-settling-vigorously.ngrok-free.app/chat', data)
      json = res.data
    } catch (error) {
      console.log(error)
    }

    console.log("json hello world ", json.response)

    // 3. Hide dots and handle matching
    setLoading(false)

    if (json.agent_type) {
      const normalizedAgent = json.agent_type.toLowerCase().replace(/_/g, ' ')
      const matchedSurvey = allSurveys.find(s => {
        const typeName = s.staticSurveyType?.staticSurveyTypeName?.toLowerCase() || ''
        return typeName.includes(normalizedAgent) || normalizedAgent.includes(typeName)
      })

      if (matchedSurvey) {
        // Auto-select the survey and move to form
        setSelectedSurvey(matchedSurvey)
        // Fix: Set propertyType so validatePostcode API doesn't receive "null"
        if (matchedSurvey.staticSurveyType?.type) {
          setPropertyType(matchedSurvey.staticSurveyType.type)
        }

        fetchQuestions(matchedSurvey.surveyorSurveyTypeID)
        setCurrentStep('form')

        setHistory(prev => [...prev, {
          sender: 'bot',
          text: `I've found the ${matchedSurvey.staticSurveyType.staticSurveyTypeName} for you. Please fill out the property details below to get your quote.`
        }])
        return
      }
    }

    // Fallback bot reply
    setHistory(prev => [...prev, { sender: 'bot', text: json.response.response || "I've received your message. You can also select a survey type below to continue." }])
  }

  const handledeletechat = async () => {

    const data = {
      user_id: "jkbhbnknj",
    }
    try {
      const res = await axios.post('https://dove-settling-vigorously.ngrok-free.app/clear', data)
      const json = await res.data

      if (json.status === 'success') {
        console.log('Chat history cleared!')
      }
      setHistory([])
      setFormData({})
      setCurrentStep('type')
      setSelectedSurvey(null)
      setPropertyType(null)
      setPostcodeID(0)
      setAddress('')
      setAddressOptions([])
      setIsValidPostcode(false)
      setLoading(false)
    } catch (error) {
      console.log(error)
    }

  }

  const renderDynamicField = (question) => {
    const { questionID, questionText, answerType, answers, answerList, required, needHelpText, questionType } = question
    const fieldName = `q_${questionID}`
    const currentValue = formData[fieldName] || ''

    // Normalize options: prefer answers array, fall back to parsing answerList string
    // This handles both API response formats dynamically
    const resolvedOptions = (answers && answers.length > 0)
      ? answers
      : (answerList ? answerList.split(',').map(a => ({ answerText: a.trim() })) : [])

    const renderLabel = () => (
      <div className="label-row">
        <label>{questionText} {required && <span className="required-star">*</span>}</label>
        {needHelpText && <button type="button" className="need-help-btn" onClick={() => alert(needHelpText)}>Need help?</button>}
      </div>
    )

    switch (answerType?.toLowerCase()) {
      case 'dropdown':
        return (
          <div className="form-field" key={questionID}>
            {renderLabel()}
            <select value={currentValue} onChange={(e) => updateFormData(fieldName, e.target.value)} required={required}>
              <option value="">Select an option</option>
              {resolvedOptions.map((ans, i) => <option key={i} value={ans.answerText}>{ans.answerText}</option>)}
            </select>
          </div>
        )
      case 'radio':
      case 'motivation':
        return (
          <div className="form-field" key={questionID}>
            {renderLabel()}
            <div className="radio-group-vertical">
              {resolvedOptions.map((ans, i) => (
                <label key={i} className={`radio-option ${currentValue === ans.answerText ? 'active' : ''}`}>
                  <input type="radio" name={fieldName} value={ans.answerText} checked={currentValue === ans.answerText} onChange={(e) => updateFormData(fieldName, e.target.value)} required={required && !currentValue} />
                  {ans.answerText}
                </label>
              ))}
            </div>
          </div>
        )
      case 'checkbox':
        return (
          <div className="form-field" key={questionID}>
            {renderLabel()}
            <div className="checkbox-group-vertical">
              {resolvedOptions.map((ans, i) => {
                const isChecked = Array.isArray(currentValue) && currentValue.includes(ans.answerText)
                return (
                  <label key={i} className={`checkbox-option ${isChecked ? 'active' : ''}`}>
                    <input type="checkbox" checked={isChecked} onChange={(e) => {
                      let nv = Array.isArray(currentValue) ? [...currentValue] : []
                      if (e.target.checked) nv.push(ans.answerText)
                      else nv = nv.filter(v => v !== ans.answerText)
                      updateFormData(fieldName, nv)
                    }} />
                    {ans.answerText}
                  </label>
                )
              })}
            </div>
          </div>
        )
      case 'textarea':
        return (
          <div className="form-field" key={questionID}>
            {renderLabel()}
            <textarea value={currentValue} onChange={(e) => updateFormData(fieldName, e.target.value)} placeholder="Enter details..." required={required} rows="3" />
          </div>
        )
      case 'number':
        if (questionType === 'property value') {
          return (
            <div className="form-field" key={questionID}>
              {renderLabel()}
              <div className="input-with-prefix">
                <span className="prefix">£</span>
                <input type="number" value={currentValue} onChange={(e) => updateFormData(fieldName, e.target.value)} placeholder="0" required={required} />
              </div>
            </div>
          )
        }
        return (
          <div className="form-field" key={questionID}>
            {renderLabel()}
            <input type="number" value={currentValue} onChange={(e) => updateFormData(fieldName, e.target.value)} placeholder="0" required={required} />
          </div>
        )
      default:
        return (
          <div className="form-field" key={questionID}>
            {renderLabel()}
            <input type={answerType === 'textbox' ? 'text' : (answerType || 'text')} value={currentValue} onChange={(e) => updateFormData(fieldName, e.target.value)} placeholder={`Enter ${questionText.toLowerCase()}...`} required={required} />
          </div>
        )
    }
  }

  const showPropertyDetails = (selectedAddressKey || isManualAddress) && isValidPostcode

  return (
    <div className={`chatbot-container ${isOpen ? 'open' : 'closed'}`}>
      {/* Header */}
      <div className="chatbot-header">
        <div className="chatbot-avatar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.07L2 22l4.93-1.37C8.42 21.5 10.15 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" /></svg>
        </div>
        <div style={{ flex: 1 }}>
          <div className="chatbot-title">SurveyBooker AI</div>
          <div className="chatbot-status">
            <span className="chatbot-status-dot" />
            <span className="chatbot-status-text">Online · Typically replies instantly</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {currentStep !== 'type' && currentStep !== 'success' && (
            <button className="chatbot-back-btn" onClick={() => {
              if (currentStep === 'form') {
                setCurrentStep('sub-option')
              } else if (currentStep === 'customer-details') {
                setCurrentStep('form')
              } else if (currentStep === 'sub-option') {
                setCurrentStep('type')
              }
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
            </button>
          )}
          <button className='chatbot-clear-btn bg-dark' onClick={handledeletechat}>
            <FaRegTrashCan className='text-white' size={15} />
          </button>
          <button className="chatbot-close-btn" onClick={onClose}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="chatbot-messages">
        <div className="bot-msg-wrapper">
          <div className="bot-avatar-small"><svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.07L2 22l4.93-1.37C8.42 21.5 10.15 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" /></svg></div>
          <div>
            <div className="bot-bubble">👋 Hello! I'm your <strong>SurveyBooker</strong> assistant. I'll help you get a quote in minutes.</div>
            <div className="msg-time">Just now</div>
          </div>
        </div>

        {history.map((msg, index) => (
          <div key={index} className={msg.sender === 'user' ? 'user-msg-wrapper' : 'bot-msg-wrapper'}>
            {msg.sender === 'bot' && <div className="bot-avatar-small"><svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.07L2 22l4.93-1.37C8.42 21.5 10.15 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" /></svg></div>}
            <div>
              <div className={msg.sender === 'user' ? 'user-bubble' : 'bot-bubble'}>{msg.text}</div>
              <div className="msg-time" style={{ textAlign: msg.sender === 'user' ? 'right' : 'left' }}>Just now</div>
            </div>
          </div>
        ))}

        {loading && (
          <div className="bot-msg-wrapper">
            <div className="bot-avatar-small"><svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.07L2 22l4.93-1.37C8.42 21.5 10.15 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" /></svg></div>
            <div className="bot-bubble loading-bubble">
              <div className="loader-dots"><span /><span /><span /></div>
            </div>
          </div>
        )}

        {/* Interactive Form content remains part of scroll history */}
        {(currentStep === 'form' || currentStep === 'customer-details') && (
          <div className="bot-msg-wrapper interactive-bot-wrapper">
            <div className="bot-avatar-small">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12c0 1.85.5 3.58 1.37 5.07L2 22l4.93-1.37C8.42 21.5 10.15 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2z" /></svg>
            </div>
            <div className="interactive-content">
              {currentStep === 'form' && !loading && (
                <form className="chatbot-form-container" onSubmit={handleFormSubmit}>
                  <div className="form-section-card">
                    <div className="form-section-label">Property Details</div>
                    <div className="form-field">
                      <div className="label-row">
                        <label>Enter the address of the property to be inspected</label>
                        <button type="button" className="need-help-btn">Need help?</button>
                      </div>

                      {!isManualAddress ? (
                        <>
                          <div className="input-with-action">
                            <input
                              placeholder="Enter the Postcode & press find"
                              value={formData.postcode}
                              onChange={(e) => updateFormData('postcode', e.target.value)}
                              required={!isManualAddress}
                            />
                            <button type="button" className="find-btn-primary" onClick={handleFindAddress} disabled={findLoading}>
                              {findLoading ? '...' : 'Find'}
                            </button>
                          </div>
                          {(addressList && addressList.length > 0) && (
                            <select className="address-dropdown" disabled={findLoading} value={selectedAddressKey} onChange={(e) => handleAddressSelect(e.target.value)} required>
                              <option value="">Please select address</option>
                              {addressList.map((a, idx) => {
                                const val = a.udprn?.toString() || a.envelopeAddress?.summaryLine || `addr-${idx}`;
                                return (
                                  <option key={val} value={val}>
                                    {a.envelopeAddress?.summaryLine || 'Address details unavailable'}
                                  </option>
                                );
                              })}
                            </select>
                          )}
                          <button type="button" className="manual-toggle-link-blue" onClick={() => setIsManualAddress(true)}>
                            My address doesn't appear as an option? Enter your address manually
                          </button>
                        </>
                      ) : (
                        <div className="manual-address-fields">
                          <button type="button" className="manual-toggle-link-blue" style={{ marginBottom: 10 }} onClick={() => { setIsManualAddress(false); setSelectedAddressKey(''); }}>
                            ← Back to Postcode search
                          </button>
                          <div className="form-field-mini"><label>Line 1</label><input value={formData.addressLine1} onChange={e => updateFormData('addressLine1', e.target.value)} required /></div>
                          <div className="form-field-mini"><label>Line 2</label><input value={formData.addressLine2} onChange={e => updateFormData('addressLine2', e.target.value)} /></div>
                          <div className="form-field-mini"><label>City</label><input value={formData.city} onChange={e => updateFormData('city', e.target.value)} required /></div>
                          <div className="form-field-mini"><label>County</label><input value={formData.county} onChange={e => updateFormData('county', e.target.value)} required /></div>
                          <div className="form-field-mini"><label>Postcode</label><input value={formData.postcode} onChange={e => updateFormData('postcode', e.target.value)} required /></div>
                        </div>
                      )}
                    </div>
                  </div>

                  {showPropertyDetails && (
                    <div className="form-section-label" style={{ marginTop: 6 }}>Survey Questions</div>
                  )}
                  {dynamicQuestions.map(q => {
                    // Hide static property questions until address is valid
                    if (q.isStatic && !showPropertyDetails) return null
                    return renderDynamicField(q)
                  })}

                  <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                    <button type="button" className="form-submit-btn-secondary" onClick={() => setCurrentStep('sub-option')} style={{ flex: 1 }}>Cancel</button>
                    <button type="submit" className="form-submit-btn-primary" style={{ flex: 1, margin: 0 }}>Continue</button>
                  </div>
                </form>
              )}

              {currentStep === 'customer-details' && (
                <form className="chatbot-form-container" onSubmit={handleGetQuote}>
                  <div className="customer-details-header" style={{ marginBottom: '10px' }}>
                    <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: '700' }}>Customer Details</h3>
                  </div>

                  <div className="form-field">
                    <div className="label-row"><label>Salutation <span className="required-star">*</span></label><button type="button" className="need-help-btn">Need help?</button></div>
                    <select value={formData.title} onChange={e => updateFormData('title', e.target.value)} required>
                      <option value="">Select Salutation</option>
                      <option value="M">M</option>
                      <option value="Mx">Mx</option>
                      <option value="Mr">Mr</option>
                      <option value="Ms">Ms</option>
                      <option value="Miss">Miss</option>
                      <option value="Mrs">Mrs</option>
                      <option value="Dr">Dr</option>
                      <option value="Lord">Lord</option>
                      <option value="Lady">Lady</option>
                      <option value="Master">Master</option>
                      <option value="Sir">Sir</option>
                      <option value="Madame">Madame</option>
                      <option value="Rev">Rev</option>
                      <option value="Sister">Sister</option>
                      <option value="Prof">Prof</option>
                      <option value="Unknown">Unknown</option>
                    </select>
                  </div>

                  <div className="form-field">
                    <div className="label-row"><label>First Name <span className="required-star">*</span></label><button type="button" className="need-help-btn">Need help?</button></div>
                    <input placeholder="Enter your first name" value={formData.firstName} onChange={e => updateFormData('firstName', e.target.value)} required />
                  </div>

                  <div className="form-field">
                    <div className="label-row"><label>Last Name <span className="required-star">*</span></label><button type="button" className="need-help-btn">Need help?</button></div>
                    <input placeholder="Enter your last name" value={formData.lastName} onChange={e => updateFormData('lastName', e.target.value)} required />
                  </div>

                  <div className="form-field">
                    <div className="label-row"><label>Your Number <span className="required-star">*</span></label><button type="button" className="need-help-btn">Need help?</button></div>
                    <input type="tel" placeholder="e.g. 07700 900000" value={formData.phoneNumber} onChange={e => updateFormData('phoneNumber', e.target.value)} required />
                  </div>

                  <div className="form-field">
                    <div className="label-row"><label>Alternative Number</label><button type="button" className="need-help-btn">Need help?</button></div>
                    <input type="tel" placeholder="e.g. 07700 900000" value={formData.altPhoneNumber} onChange={e => updateFormData('altPhoneNumber', e.target.value)} />
                  </div>

                  <div className="form-field">
                    <div className="label-row"><label>Your Email <span className="required-star">*</span></label><button type="button" className="need-help-btn">Need help?</button></div>
                    <input type="email" placeholder="hello@example.com" value={formData.email} onChange={e => updateFormData('email', e.target.value)} required />
                  </div>

                  <div className="disclaimer-text" style={{ fontSize: '11px', color: '#9ca3af', lineHeight: '1.4', marginTop: '10px' }}>
                    It is important that your details are accurate to ensure your quote is valid. We reserve the right to revise our quote if additional information becomes available.
                  </div>

                  {error && <div style={{ color: '#ef4444', fontSize: '13px', textAlign: 'center', marginBottom: '10px' }}>{error}</div>}

                  <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                    <button type="button" className="form-submit-btn-secondary" onClick={() => setCurrentStep('form')} style={{ flex: 1 }}>Back</button>
                    <button type="submit" className="form-submit-btn-primary" style={{ flex: 1, margin: 0 }} disabled={loading}>{loading ? 'Processing...' : 'Get Quote'}</button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Options Area (Sticky at bottom, above input) */}
      {(currentStep === 'type' || currentStep === 'sub-option') && (
        <div className="chatbot-quick-options">
          <div className="quick-options-header">
            <span className="options-label">
              {currentStep === 'type' ? 'Select Property Type' : `${surveys.length} ${propertyType} Surveys Found`}
            </span>
            <button className="hide-options-btn" onClick={() => setShowOptions(!showOptions)}>
              {showOptions ? 'Hide' : 'Show Options'}
            </button>
          </div>

          {showOptions && (
            <div className="chatbot-options-container">
              {currentStep === 'type' && (
                <div className="chips-row">
                  {dynamicPropertyTypes.map(opt => (
                    <button key={opt.id} className="option-chip" onClick={() => handleTypeSelect(opt.id)}>
                      <span className="chip-icon">{opt.icon}</span>
                      <span className="chip-label">{opt.label}</span>
                    </button>
                  ))}
                </div>
              )}

              {currentStep === 'sub-option' && !loading && (
                <div className="chips-row chips-vertical">
                  {surveys.map(survey => (
                    <button key={survey.surveyorSurveyTypeID} className="option-chip vertical-chip" onClick={() => handleSurveySelect(survey)}>
                      <span className="chip-icon">
                        <img
                          src={`https://sandbox.surveybooker.co.uk/images/survey-icons/${survey.staticSurveyType.icon || 'default.png'}`}
                          alt="icon"
                          onError={(e) => { e.target.src = 'https://img.icons8.com/ios/50/4f8ef7/document.png' }}
                          style={{ width: 16, height: 16 }}
                        />
                      </span>
                      <span className="chip-label">{survey.staticSurveyType.staticSurveyTypeName}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Footer / Message Input */}
      {currentStep !== 'success' && (
        <div className="chatbot-input-container">
          <form className="input-wrapper" onSubmit={handleSendMessage}>
            <input
              className="chatbot-input"
              placeholder={currentStep === 'form' || currentStep === 'customer-details' ? "Please complete the form..." : "Ask a question..."}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={currentStep === 'form' || currentStep === 'customer-details'}
            />
            <button type="submit" className="send-btn" disabled={currentStep === 'form' || currentStep === 'customer-details'}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill={currentStep === 'form' || currentStep === 'customer-details' ? "#4b5563" : "white"}>
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </form>
        </div>
      )}

      {currentStep === 'success' && (
        <div className="success-area">
          <button onClick={() => {
            setCurrentStep('type');
            setPropertyType(null);
            setSelectedSurvey(null);
            setIsManualAddress(false);
            setAddressList([]);
            setSelectedAddressKey('');
            setFormData({ postcode: '', addressLine1: '', addressLine2: '', city: '', county: '', tenure: '', additionalInfo: '', estimatedValue: '', bedrooms: '', buildingType: '', title: 'Mr', firstName: '', lastName: '', phoneNumber: '', altPhoneNumber: '', email: '' });
            setHistory(prev => [...prev, { sender: 'bot', text: "New quote started! How can I help you today?" }]);
          }} className="form-submit-btn-primary">Start New Quote</button>
        </div>
      )}
    </div>
  )
}

export default Chatview