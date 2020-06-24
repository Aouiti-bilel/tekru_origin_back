import React, { useEffect, useState } from 'react';
import withReducer from 'app/store/withReducer';
import { useDispatch, useSelector } from 'react-redux';
import * as Actions from './store/actions';
import reducer from './store/reducers';
import { FusePageSimple } from '@fuse';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import CoverImageEditor from './components/cover-image-editor';
import Typography from "@material-ui/core/Typography";
import Icon from "@material-ui/core/Icon";
import Paper from "@material-ui/core/Paper";
import Input from "@material-ui/core/Input";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import CircularProgress from "@material-ui/core/CircularProgress";
import SaveIcon from '@material-ui/icons/Save';
import * as FuseActions from 'app/store/actions';
import ReactHtmlParser from 'react-html-parser';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { contentService } from 'app/services/originServices';
import TimeAgo from 'react-timeago'
import frenchStrings from 'react-timeago/lib/language-strings/fr'
import buildFormatter from 'react-timeago/lib/formatters/buildFormatter'
import tkrUploadAdapter from './libs/uploadAdapter';
import {
	MuiPickersUtilsProvider,
	KeyboardDatePicker,
} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import LinearProgress from '@material-ui/core/LinearProgress';
import { useTranslation } from "react-i18next";

const useStyles = makeStyles(theme => ({
	header: {
		background: 'linear-gradient(to right, ' + theme.palette.primary.dark + ' 0%, ' + theme.palette.primary.main + ' 100%)',
		color: theme.palette.getContrastText(theme.palette.primary.main)
	},
	headerIcon: {
		position: 'absolute',
		top: -64,
		left: 0,
		opacity: .04,
		fontSize: 512,
		width: 512,
		height: 512,
		pointerEvents: 'none'
	},
	actionsHeader: {
		textAlign: 'right',
		width: '100%',
		padding: '0px 24px',
	},
	displayToolbar: {
		width: '100%',
		textAlign: 'right',
		paddingRight: '50px',
	},
	displayToolbarTitle: {
		fontWeight: 'bold',
	},
	activeDisplayButton: {
		background: '#303030 !important',
		color: 'white !important',
		margin: '0px 5px',
	},
	disactiveDisplayButton: {
		margin: '0px 5px',
	},
	toolbarElement: {
		display: 'inline',
		marginLeft: '10px',
	},
	orderBySelect: {
		fontSize: 'small',
		padding: '5px 5px 5px 15px',
	},
	featuredImage: {
		height: '400px',
		backgroundSize: 'cover',
		backgroundPosition: 'center',
	},
	contentDetail: {
		marginRight: '5px'
	}
}));

function Page(props) {
	const { t } = useTranslation();
	const { match } = props;
	const dispatch = useDispatch();
	const { data } = useSelector(({ newsBlockApp }) => newsBlockApp);
	const user = useSelector(({ auth }) => auth.user);
	const formatter = buildFormatter(frenchStrings);
	const classes = useStyles(props);
	const [content, setContent] = useState(null);
	const [id, setContentId] = useState(null);
	const [edit, setEdit] = useState(false);
	const [loading, setLoading] = useState(false);
	const statusTxt = [
		t("content_status.published"),
		t("content_status.draft"),
		t("content_status.hidden"),
		t("content_status.planned"),
	]

	function handleFormSubmit(event) {
		setLoading(true);
		let data = {
			id: content.id,
			title: content.title,
			content: content.content,
			status: content.status,
			publishedAt: content.publishedAt,
		}
		contentService.up(data)
			.then((response) => {
				setLoading(false);
				// Show a message
				dispatch(
					FuseActions.showMessage({
						message: t("success.content_saved"),
						autoHideDuration: 3000,
						variant: 'success' //success error info warning null
					}));
				// Dispatch data 
				if (content.id > 0) {
					dispatch(Actions.updateContent(content.id, data.title, 'title'));
					dispatch(Actions.updateContent(content.id, data.content, 'content'));
					dispatch(Actions.updateContent(content.id, data.status, 'status'));
					dispatch(Actions.updateContent(content.id, Date.now(), 'updatedAt'));
					dispatch(Actions.updateContent(content.id, content.publishedAt, 'publishedAt'));
				} else {
					setContentId(response);
					dispatch(
						Actions.addContent({
							...content,
							id: response,
							createdAt: Date.now()
						}, true)
					);
				}
			})
			.catch(error => {
				setLoading(false);
				dispatch(FuseActions.showMessage({
					message: (error[0] !== undefined ? error[0].message : t("error.saving")),
					variant: 'error' //success error info warning null
				}));
			});
	}

	useEffect(() => {
		dispatch(Actions.getContents());
	}, [dispatch]);

	useEffect(() => {
		const { url, params } = match;
		const { contentId } = params;
		const edit = url.indexOf('news-block/edit/') >= 0 || url.indexOf('news-block/create') >= 0;
		setEdit(edit);
		setContentId(parseInt(contentId));
	}, [match]);

	useEffect(() => {
		// Handle toBePublished flag
		if (content) {
			const today = new Date();
			const publishedAt = new Date(content.publishedAt);
			content.toBePublishedFlag = (publishedAt.getTime() > today.getTime());
		}
		// Handle content text
		if (content && content.id !== 0 && !content.content) {
			dispatch(Actions.getContentText(content.id));
		}
	}, [content, dispatch]);

	useEffect(() => {
		if (data && id > 0) {
			const content_ = data.find(el => el.id === id);
			if (content_) {
				setContent(content_);
			}
		} else if (edit) {
			setContent({
				id: 0,
				featured_image: null,
				title: '',
				content: '',
				status: 2,
				author: {
					prenom: user.data.firstName,
					nomFamille: user.data.lastName,
				}
			});
		}
	}, [id, data, user, edit]);

	return (
		<FusePageSimple
			classes={{
				root: classes.layoutRoot
			}}
			header={
				<div className="flex flex-1 items-center justify-between p-24">
					<div className="flex flex-col">
						<div className="flex items-center">
							<Icon className="text-18" color="action">bookmarks</Icon>
							<Icon className="text-16" color="action">chevron_right</Icon>
							<Typography
								color="textSecondary"
								to={edit ? '/news-block/admin/' : "/news-block"}
								component={Link}
								style={{ color: 'rgba(255, 255, 255, 0.7)' }}
							>{t("news_block")}</Typography>
							{
								content && (
									<>
										<Icon className="text-16" color="action">chevron_right</Icon>
										<Typography color="textSecondary">{content.title}</Typography>
									</>
								)
							}
						</div>
					</div>
				</div>
			}
			contentToolbar={
				edit && (
					<div className="flex flex-1 relative overflow-hidden">
						<div className={'p-24 w-full max-w-lg rounded-8 overflow-hidden '} style={{ margin: 'auto' }}>
							<FormControl>
								<Button variant="outlined" color="primary" disabled={loading} onClick={handleFormSubmit}>
									{loading ? (
										<CircularProgress style={{
											width: '25px', height: '25px'
										}} />
									) : (
											<>
												<SaveIcon style={{
													width: '25px',
													height: '25px',
												}} />
											</>
										)}
									<span style={{ marginLeft: '5px' }}>{t("save")}</span>
								</Button>
							</FormControl>
						</div>
					</div>
				)
			}
			content={
				content && (
					<div className="flex flex-1 relative overflow-hidden">
						<div className="w-full overflow-auto">
							<div className="flex justify-center p-16 pb-64 sm:p-24 sm:pb-64 md:p-48 md:pb-64" style={{ padding: (edit ? '0' : '') }}>
								<Paper className="w-full max-w-lg rounded-8 overflow-hidden mb-24" elevation={1}>
									{(!edit ? (
										<div className={classes.featuredImage} style={{
											backgroundImage: `url(${(content.featured_image ? content.featured_image : 'assets/images/news-block/default-image.png')})`
										}}></div>
									) :
										(content.id > 0 && (
											<div className="px-24 pt-16">
												<CoverImageEditor image={content.featured_image} post_id={content.id} />
											</div>
										))
									)}
									<div className={"p-24" + (edit ? ' pt-0' : '')}>
										{(edit ? (
											<div className="flex flex-wrap py-24">
												<Box className="w-full sm:w-1/1 lg:w-1/1 flex flex-col mb-16">
													<FormControl disabled={loading}>
														<InputLabel htmlFor="content-status">{t("title")}</InputLabel>
														<Input
															className="font-bold"
															placeholder={t("title")}
															type="text"
															name="title"
															value={content.title}
															onChange={e => setContent({
																...content,
																title: e.target.value
															})}
															readOnly={loading}
															fullWidth
														/>
													</FormControl>
												</Box>
												<Box className="w-full sm:w-1/2 lg:w-1/2 flex flex-col" p={{ xs: '14px 0px 14px 0px', sm: '0' }} >
													<FormControl disabled={loading}>
														<InputLabel htmlFor="content-status">{t("status")}</InputLabel>
														<Select
															value={content.status}
															onChange={e => setContent({
																...content,
																status: e.target.value
															})}
															inputProps={{
																name: 'age',
																id: 'content-status',
															}}
														>
															<MenuItem value={1}>{statusTxt[0]}</MenuItem>
															<MenuItem value={2}>{statusTxt[1]}</MenuItem>
															<MenuItem value={3}>{statusTxt[2]}</MenuItem>
														</Select>
													</FormControl>
												</Box>
												<Box className="w-full sm:w-1/2 lg:w-1/2 flex flex-col" p={{ xs: '14px 0px 14px 0px', sm: '0' }} >
													<MuiPickersUtilsProvider utils={DateFnsUtils}>
														<FormControl disabled={loading}>
															<KeyboardDatePicker
																className="font-bold"
																disableToolbar
																variant="inline"
																format="dd/MM/yyyy"
																id="publishedAt"
																label={t("publishing_date")}
																value={content.publishedAt}
																onChange={date => setContent({
																	...content,
																	publishedAt: date
																})}
																readOnly={loading}
																fullWidth
																KeyboardButtonProps={{
																	'aria-label': 'change date',
																}}
															/>
														</FormControl>
													</MuiPickersUtilsProvider>
												</Box>
											</div>
										) : (
												<Typography variant="h6" className="pb-12">{content.title}</Typography>
											))}

										{!edit && (
											<div>
												<Typography variant="caption">
													<span className={classes.contentDetail}>
														<strong>{t("author")}:</strong> {content.author.prenom} {content.author.nomFamille}
													</span>
													{
														(!edit) && (
															<span className={classes.contentDetail}>
																| <strong> {t("status")}:</strong> {content.toBePublishedFlag ? statusTxt[3] : statusTxt[content.status - 1]}
															</span>
														)
													}
													<div></div>
													{
														content.publishedAt && (
															<span className={classes.contentDetail}>
																<strong>{content.toBePublishedFlag ? t("content_status.planned") : t("content_status.published")}:</strong> <TimeAgo date={content.publishedAt} formatter={formatter} />
															</span>
														)
													}
													{
														(content.updatedAt && content.updatedAt !== content.createdAt) && (
															<span>
																| <strong>{t('update')}:</strong> <TimeAgo date={content.updatedAt} formatter={formatter} />
															</span>
														)
													}
												</Typography>
											</div>
										)}

										{(edit ? (
											<div className="py-12 pb-12">
												{
													(content === null || content.content === null || content.content === undefined) ? (
														<LinearProgress variant="query" />
													) : (
															<CKEditor
																editor={ClassicEditor}
																data={(content.content ? content.content : '')}
																onInit={editor => {
																	editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
																		return new tkrUploadAdapter(loader);
																	};
																}}
																onChange={(event, editor) => {
																	const data = editor.getData();
																	setContent({
																		...content,
																		content: data,
																	});
																}}
															/>
														)
												}
											</div>
										) : (
												<div className="py-12 pb-12" style={{ overflowX: 'hidden', overflowY: 'scroll' }}>
													{
														!content.content ? (
															<LinearProgress variant="query" />
														) : (
																ReactHtmlParser(content.content)
															)
													}
												</div>
											))}
									</div>
								</Paper>
							</div>
						</div>
					</div>
				)
			}
		/>
	)
}

export default withReducer('newsBlockApp', reducer)(Page);