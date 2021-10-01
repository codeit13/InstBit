from defines_py3 import getCreds, makeApiCall
import time, json

def createMediaObject( params ) :
	""" Create media object

	Args:
		params: dictionary of params
	
	API Endpoint:
		https://graph.facebook.com/v5.0/{ig-user-id}/media?image_url={image-url}&caption={caption}&access_token={access-token}
		https://graph.facebook.com/v5.0/{ig-user-id}/media?video_url={video-url}&caption={caption}&access_token={access-token}

	Returns:
		object: data from the endpoint

	"""

	url = params['endpoint_base'] + params['instagram_account_id'] + '/media' # endpoint url

	endpointParams = dict() # parameter to send to the endpoint
	endpointParams['caption'] = params['caption']  # caption for the post
	endpointParams['access_token'] = params['access_token'] # access token

	if 'IMAGE' == params['media_type'] : # posting image
		endpointParams['image_url'] = params['media_url']  # url to the asset
	else : # posting video
		endpointParams['media_type'] = params['media_type']  # specify media type
		endpointParams['video_url'] = params['media_url']  # url to the asset
	
	return makeApiCall( url, endpointParams, 'POST' ) # make the api call

def getMediaObjectStatus( mediaObjectId, params ) :
	""" Check the status of a media object

	Args:
		mediaObjectId: id of the media object
		params: dictionary of params
	
	API Endpoint:
		https://graph.facebook.com/v5.0/{ig-container-id}?fields=status_code

	Returns:
		object: data from the endpoint

	"""

	url = params['endpoint_base'] + '/' + mediaObjectId # endpoint url

	endpointParams = dict() # parameter to send to the endpoint
	endpointParams['fields'] = 'status_code' # fields to get back
	endpointParams['access_token'] = params['access_token'] # access token

	return makeApiCall( url, endpointParams, 'GET' ) # make the api call

def publishMedia( mediaObjectId, params ) :
	""" Publish content

	Args:
		mediaObjectId: id of the media object
		params: dictionary of params
	
	API Endpoint:
		https://graph.facebook.com/v5.0/{ig-user-id}/media_publish?creation_id={creation-id}&access_token={access-token}

	Returns:
		object: data from the endpoint

	"""

	url = params['endpoint_base'] + params['instagram_account_id'] + '/media_publish' # endpoint url

	endpointParams = dict() # parameter to send to the endpoint
	endpointParams['creation_id'] = mediaObjectId # fields to get back
	endpointParams['access_token'] = params['access_token'] # access token

	return makeApiCall( url, endpointParams, 'POST' ) # make the api call

def getContentPublishingLimit( params ) :
	""" Get the api limit for the user

	Args:
		params: dictionary of params
	
	API Endpoint:
		https://graph.facebook.com/v5.0/{ig-user-id}/content_publishing_limit?fields=config,quota_usage

	Returns:
		object: data from the endpoint

	"""

	url = params['endpoint_base'] + params['instagram_account_id'] + '/content_publishing_limit' # endpoint url

	endpointParams = dict() # parameter to send to the endpoint
	endpointParams['fields'] = 'config,quota_usage' # fields to get back
	endpointParams['access_token'] = params['access_token'] # access token

	return makeApiCall( url, endpointParams, 'GET' ) # make the api call

def postMedia(type, url, caption) :
	if type == "IMAGE":
		params = getCreds()
		params['media_type'] = type
		params['media_url'] = url
		params['caption'] = caption

		imageMediaObjectResponse = createMediaObject( params ) # create a media object through the api

		if 'id' not in imageMediaObjectResponse['json_data'] :
			print(json.dumps(imageMediaObjectResponse['json_data']))
			return json.dumps(imageMediaObjectResponse['json_data'])

		imageMediaObjectId = imageMediaObjectResponse['json_data']['id'] # id of the media object that was created
		imageMediaStatusCode = 'IN_PROGRESS';		

		while imageMediaStatusCode != 'FINISHED' : # keep checking until the object status is finished
			imageMediaObjectStatusResponse = getMediaObjectStatus( imageMediaObjectId, params ) # check the status on the object
			imageMediaStatusCode = imageMediaObjectStatusResponse['json_data']['status_code'] # update status code

			time.sleep( 5 ) # wait 5 seconds if the media object is still being processed

		publishImageResponse = publishMedia( imageMediaObjectId, params ) # publish the post to instagram
			
	elif type == "VIDEO":
		params = getCreds()
		params['media_type'] = type
		params['media_url'] = url
		params['caption'] = caption

		videoMediaObjectResponse = createMediaObject( params ) # create a media object through the api

		if 'id' not in videoMediaObjectResponse['json_data'] :
			return json.dumps(videoMediaObjectResponse['json_data'])

		videoMediaObjectId = videoMediaObjectResponse['json_data']['id'] # id of the media object that was created
		videoMediaStatusCode = 'IN_PROGRESS';

		while videoMediaStatusCode != 'FINISHED' : # keep checking until the object status is finished
			videoMediaObjectStatusResponse = getMediaObjectStatus( videoMediaObjectId, params ) # check the status on the object
			videoMediaStatusCode = videoMediaObjectStatusResponse['json_data']['status_code'] # update status code

			time.sleep( 5 ) # wait 5 seconds if the media object is still being processed

		publishVideoResponse = publishMedia( videoMediaObjectId, params ) # publish the post to instagram
	
	print("Image Posted Successfully")
	return "Image Posted Successfully"