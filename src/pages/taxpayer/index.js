import React, { useEffect, useState } from 'react'
import axios from "axios";
import url from "../../config/url";
import setAuthToken from "../../functions/setAuthToken";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useForm } from 'react-hook-form';
import Loader from 'react-loader-spinner';
import { useRouter } from 'next/router';

export default function Index() {
    const [taxOffice, setTaxOffice] = useState([])
    const [incomeSource, setIncomSource] = useState([])
    const [state, setState] = useState([])
    const [isFetching, setIsFetching] = useState(false)
    const [lga, setLga] = useState([])
    const [createError, setCreateError] = useState("")
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm()

    const kogiLga = lga.filter(item => item.jtb_states === 22);

    useEffect(() => {

        setAuthToken();
        const fetchPost = async () => {
            try {
                let res = await axios.get(`${url.BASE_URL}user/items`);
                console.log(res);
                let itemsBody = res.data.body
                let taxOffice = itemsBody.taxOffice
                let incSource = itemsBody.incomeSource
                let stat = itemsBody.state
                let lg = itemsBody.lga
                setIncomSource(incSource)
                setTaxOffice(taxOffice)
                setState(stat)
                setLga(lg)
            } catch (e) {
                console.log(e);
            }
        };
        fetchPost();

    }, []);

    const onSubmit = (data) => {
        setIsFetching(true)
        axios.post(`${url.BASE_URL}taxpayer/new-individual`, data)
            .then(function (response) {
                setIsFetching(false)
                toast.success("Created Successfully!");
                router.push('/reports-individual')
            })
            .catch(function (error) {
                setIsFetching(false)
                if (error.response) {
                    setCreateError(() => error.response.data.message);
                    toast.error(createError)
                } else {
                    toast.error("Failed to create Taxpayer!");
                }

            })
    };



    return (
        <div>
            <ToastContainer />
            <div className="block p-6 rounded-lg bg-white w-full">

                {isFetching && (
                    <div className="flex justify-center item mb-2">
                        <Loader
                            visible={isFetching}
                            type="BallTriangle"
                            color="#00FA9A"
                            height={19}
                            width={19}
                            timeout={0}
                            className="ml-2"
                        />
                        <p className="font-bold">Creating Taxpayer...</p>
                    </div>
                )}
                <div className="flex justify-center mb-4">
                    <h6 className="p-2 font-bold">Register Individual Taxpayer</h6>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="form-group ">
                            <p>Title <span className="text-red-400">*</span></p>
                            <select name="indv_title" required ref={register()} className="form-control SlectBox mb-4 w-full rounded font-light text-gray-500">
                                <option value="">Please Select</option>
                                <option value="Mr">Mr</option>
                                <option value="Mrs">Mrs</option>
                                <option value="Mrss">Miss</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <p>Surname <span className="text-red-400">*</span></p>
                            <input name="surname" required type="text" className="form-control mb-4 w-full rounded font-light text-gray-500" ref={register({ required: "Surname is required" })}
                            />
                            {errors.surname && <small className="text-red-600">{errors.surname.message}</small>}
                        </div>

                        <div className="form-group ">
                            <p>First Name <span className="text-red-400">*</span></p>
                            <input name="first_name" required ref={register({ required: "First name is required" })} type="text" className="form-control mb-4 w-full rounded font-light text-gray-500"
                            />
                            {errors.first_name && <small className="text-red-600">{errors.first_name.message}</small>}
                        </div>

                        <div className="form-group ">
                            <p>Middle name</p>
                            <input name="middle_name" ref={register()} type="text" className="form-control mb-4 w-full rounded font-light text-gray-500"
                            />
                        </div>

                        <div className="form-group ">
                            <p>Date of Birth <span className="text-red-400">*</span></p>
                            <input name="birth_date" required ref={register({ required: "Birthdate is required" })} type="date" className="form-control mb-4 w-full rounded font-light text-gray-500"
                            />
                            {errors.birth_date && <small className="text-red-600">{errors.birth_date.message}</small>}
                        </div>


                        <div className="form-group ">
                            <p>Phone Number <span className="text-red-400">*</span></p>
                            <input name="phone_number" required ref={register({ required: "Phone number is Required" })} type="text" className="form-control mb-4 w-full rounded font-light text-gray-500"
                            />
                            {errors.phone_number && <small className="text-red-600">{errors.phone_number.message}</small>}
                        </div>

                        <div className="form-group ">
                            <p>Gender <span className="text-red-400">*</span></p>
                            <select name="gender" required ref={register({ required: "Gender is Required" })} className="form-control SlectBox mb-4 w-full rounded font-light text-gray-500">
                                <option value="">Please Select</option>
                                <option value="Female">Female</option>
                                <option value="Male">Male</option>
                            </select>
                            {errors.gender && <small className="text-red-600">{errors.gender.message}</small>}
                        </div>

                        <div className="form-group ">
                            <p>Marital Status <span className="text-red-400">*</span></p>
                            <select name="marital_status" required ref={register()} className="form-control SlectBox mb-4 w-full rounded font-light text-gray-500">
                                <option value="">Please Select</option>
                                <option value="Single">Single</option>
                                <option value="Married">Married</option>
                            </select>
                        </div>

                        <div className="form-group ">
                            <p>State of residence</p>
                            <input readOnly name="state_of_residence" value="Kogi" ref={register()} type="text" className="form-control mb-4 w-full rounded font-light text-gray-500"
                            />
                        </div>

                        <div className="form-group ">
                            <p>LGA <span className="text-red-400">*</span></p>
                            <select name="lga" required ref={register({ required: "LGA is Required" })} className="form-control SlectBox mb-4 w-full rounded font-light text-gray-500">
                                <option value="">Please Select</option>
                                {kogiLga.map((lg) => <option key={lg.idlga} value={lg.name}>{lg.name}</option>)}
                            </select>
                            {errors.lga && <small className="text-red-600">{errors.lga.message}</small>}
                        </div>
                        <div className="form-group ">
                            <p>BVN</p>
                            <input name="bvn" ref={register()} type="text" className="form-control mb-4 w-full rounded font-light text-gray-500"
                            />
                        </div>
                        <div className="form-group ">
                            <p>Tax Office <span className="text-red-400">*</span></p>
                            <select name="tax_office" required ref={register({ required: "Tax office is Required" })} className="form-control SlectBox mb-4 w-full rounded font-light text-gray-500">
                                <option value="">Please Select</option>
                                {taxOffice.map((office) => <option key={office.idstation} value={office.station_code}>{office.name}</option>)}
                            </select>
                            {errors.tax_office && <small className="text-red-600">{errors.tax_office.message}</small>}
                        </div>
                    </div>
                    <div className="m-4">
                        <hr />
                        <h6 className="m-3 font-bold">Additional Information</h6>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="form-group">
                            <p>Email</p>
                            <input name="email" ref={register()} type="email" className="form-control mb-4 w-full rounded font-light text-gray-500"
                            />
                        </div>
                        <div className="form-group">
                            <p>Alternate phone number</p>
                            <input name="mobile_number" ref={register()} type="text" className="form-control mb-4 w-full rounded font-light text-gray-500"
                            />
                        </div>

                        <div className="form-group ">
                            <p>Birth Place <span className="text-red-400">*</span></p>
                            <input name="birth_place" required ref={register({ required: "Birth Place is Required" })} type="text" className="form-control mb-4 w-full rounded font-light text-gray-500"
                            />
                            {errors.birth_place && <small className="text-red-600">{errors.birth_place.message}</small>}
                        </div>
                        <div className="form-group ">
                            <p>Occupation</p>
                            <input name="occupation" ref={register()} type="text" className="form-control mb-4 w-full rounded font-light text-gray-500"
                            />
                        </div>
                        <div className="form-group ">
                            <p>Mother's Name</p>
                            <input name="mother_name" ref={register()} type="text" className="form-control mb-4 w-full rounded font-light text-gray-500"
                            />
                        </div>

                        <div className="form-group ">
                            <p>House no</p>
                            <input name="house_no" ref={register()} type="text" className="form-control mb-4 w-full rounded font-light text-gray-500"
                            />
                        </div>
                        <div className="form-group ">
                            <p>Street</p>
                            <input name="street" ref={register()} type="text" className="form-control mb-4 w-full rounded font-light text-gray-500"
                            />
                        </div>
                        <div className="form-group ">
                            <p>Ward</p>
                            <input name="ward" ref={register()} type="text" className="form-control mb-4 w-full rounded font-light text-gray-500"
                            />
                        </div>
                        <div className="form-group ">
                            <p>City</p>
                            <input name="city" ref={register()} type="text" className="form-control mb-4 w-full rounded font-light text-gray-500"
                            />
                        </div>
                        <div className="form-group ">
                            <p>Nationality</p>
                            <input name="nationality" ref={register()} readOnly value={'Nigerian'} type="text" className="form-control mb-4 w-full rounded font-light text-gray-500"
                            />
                        </div>

                        <div className="form-group ">
                            <p>State of Origin</p>
                            <select name="state_of_origin" ref={register()} className="form-control SlectBox mb-4 w-full rounded font-light text-gray-500">
                                {state.map((st) => <option key={st.jtb_idstates} value={st.jtb_idstates}>{st.state}</option>)}
                            </select>
                        </div>
                        <div className="form-group ">
                            <p>Income Source</p>
                            <select name="income_source" ref={register()} className="form-control SlectBox mb-4 w-full rounded font-light text-gray-500">
                                {incomeSource.map((src) => <option key={src.id} value={src.source}>{src.source}</option>)}
                            </select>
                        </div>
                        {/* <div className="form-group col-span-2">
                            <p>Tax Authority</p>
                            <input readOnly name="tax_authority" value="Kogi State Internal Revenue Service" ref={register()} type="text" className="form-control mb-4 w-full rounded font-light text-gray-500" />
                        </div> */}
                    </div>

                    <div className="mb-6 flex justify-center">
                        <button
                            style={{ backgroundColor: "#84abeb" }}
                            className="btn btn-default text-white btn-outlined bg-transparent rounded-md"
                            type="submit"
                        >
                            Register
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
